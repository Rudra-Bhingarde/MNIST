from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import tensorflow as tf

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained MNIST model
# Make sure the 'models/model1.h5' path is correct relative to server.py
model = tf.keras.models.load_model("models/model1.h5") 

class ImageData(BaseModel):
    image: str

@app.post("/predict")
# server.py
@app.post("/predict")
async def predict(data: ImageData):
    # ... (Decoding and resizing code)
    image_bytes = base64.b64decode(data.image.split(",")[1])
    img = Image.open(BytesIO(image_bytes)).convert("L")  # grayscale
    img = img.resize((28, 28), Image.Resampling.LANCZOS)
    
    # Convert to numpy and normalize (0.0 to 1.0)
    img_array = np.array(img, dtype=np.float32) # Specify float32 for consistency with TF
    img_array = img_array / 255.0 
    
    # --- FIX: EXPAND DIMENSIONS ---
    # Add the Batch dimension (axis 0) and the Channel dimension (axis -1)
    img_array = np.expand_dims(img_array, axis=(0, -1)) # Shape becomes (1, 28, 28, 1)
    
    # --- Debugging (Optional, check new shape) ---
    print(f"New Input Shape: {img_array.shape}") # Should now print (1, 28, 28, 1)
    
    # Predict
    pred = model.predict(img_array)
    digit = int(np.argmax(pred))

    return {"prediction": digit}
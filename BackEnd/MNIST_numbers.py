import tensorflow as tf
import matplotlib.pyplot as plt

# Load MNIST data
(Xtrain, Ytrain), (Xtest, Ytest) = tf.keras.datasets.mnist.load_data()

# Pick the first image
image = Xtrain[0]
label = Ytrain[0]

# Display the image
plt.imshow(image, cmap='gray')  # MNIST images are grayscale
plt.title(f"Label: {label}")
plt.axis('off')  # Hide axes for clarity
plt.show()

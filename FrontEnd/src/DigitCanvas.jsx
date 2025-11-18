// DigitCanvas.jsx (No changes needed)
import React, { useRef, useState, useEffect } from "react";

export default function DigitCanvas() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Black background to match MNIST
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = () => setDrawing(true);
  const stopDrawing = () => {
    setDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    // To stop lines from connecting when the mouse button is lifted
    ctx.beginPath(); 
  };

  const draw = (e) => {
    if (!drawing) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 40;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white"; // White brush like MNIST digits

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setPrediction(null);
  };

  const predictDigit = async () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        const data = await response.json();
        setPrediction(data.prediction);
    } catch (error) {
        console.error("Prediction failed:", error);
        setPrediction("Error");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Draw a digit</h2>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "2px solid black" }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onMouseMove={draw}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={predictDigit} style={{ marginLeft: "10px" }}>
          Predict
        </button>
      </div>
      {prediction !== null && <h3>Prediction: {prediction}</h3>}
    </div>
  );
}
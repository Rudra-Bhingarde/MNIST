import React, { useRef, useState, useEffect } from "react";

export default function DigitCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);

    ctx.lineWidth = 35;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
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
    } catch (err) {
      console.error(err);
      setPrediction("Error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#121212",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "30px",
        fontFamily: "Poppins, sans-serif",
        color: "white",
      }}
    >
      <h2
        style={{
          fontSize: "30px",
          marginBottom: "15px",
          fontWeight: 500,
          opacity: 0.95,
        }}
      >
        Draw a Digit
      </h2>

      <div
        style={{
          border: "2px solid #2a2a2a",
          borderRadius: "10px",
          padding: "8px",
          marginBottom: "20px",
          background: "#1c1c1c",
        }}
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={{
            borderRadius: "8px",
            background: "black",
            touchAction: "none",
            cursor: "crosshair",
          }}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={clearCanvas}
          style={{
            padding: "12px 24px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#252525",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Clear
        </button>

        <button
          onClick={predictDigit}
          style={{
            padding: "12px 24px",
            borderRadius: "6px",
            border: "1px solid #007bff",
            background: "#0d47a1",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          Predict
        </button>
      </div>

      {prediction !== null && (
        <div
          style={{
            marginTop: "30px",
            padding: "16px 32px",
            background: "#1d1d1d",
            borderRadius: "10px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ fontSize: "26px", margin: 0 }}>
            Prediction: <span style={{ color: "#4dabf7" }}>{prediction}</span>
          </h3>
        </div>
      )}
    </div>
  );
}

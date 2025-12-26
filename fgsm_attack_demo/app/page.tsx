"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [epsilon, setEpsilon] = useState<number>(0.1);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  const runAttack = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("epsilon", epsilon.toString());

    try {
      const res = await fetch("http://<EC2_PUBLIC_IP>:8000/attack", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">FGSM Attack Demo</h1>

      <div className="mb-4">
        <input type="file" onChange={handleUpload} />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Epsilon: {epsilon}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={epsilon}
          onChange={(e) => setEpsilon(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={runAttack}
        disabled={!image || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Attack"}
      </button>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Attack Success: {result.attack_success ? "Yes" : "No"}
          </h2>

          <p>Clean Prediction: {result.clean_prediction}</p>
          <p>Adversarial Prediction: {result.adversarial_prediction}</p>

          <div className="flex gap-6 mt-4">
            <div>
              <h4 className="font-semibold mb-1">Adversarial Image</h4>
              <img
                src={`data:image/png;base64,${result.adversarial_image_base64}`}
                width={200}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

import React, { useState } from "react";
import predictAnomalyTomorrow from "../api/predictAnomaly";

const AnomalyChatbot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Pose-moi une question sur les anomalies de température de demain !" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    if (input.toLowerCase().includes("anomalie") && input.toLowerCase().includes("demain")) {
      setLoading(true);
      const result = await predictAnomalyTomorrow();
      setLoading(false);
      if (result.error) {
        setMessages(msgs => [...msgs, { from: "bot", text: "Erreur : " + result.error }]);
      } else {
        setMessages(msgs => [
          ...msgs,
          { from: "bot", text: result.message }
        ]);
      }
    } else {
      setMessages(msgs => [
        ...msgs,
        { from: "bot", text: "Je peux te dire s'il y aura une anomalie de température demain. Pose-moi la question !" }
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-300 rounded-xl shadow-lg p-4 z-50">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.from === "bot" ? "text-blue-700" : "text-gray-800 text-right"}`}>
            <span className="block">{msg.text}</span>
          </div>
        ))}
        {loading && <div className="text-blue-500">Analyse en cours...</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ta question..."
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
};

export default AnomalyChatbot; 
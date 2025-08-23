import React, { useEffect, useState } from "react";
import "../Styles/Dashboard.css";

const DashboardPage = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Formato de 12 horas
  const timeString = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  // Saludo según la hora
  const hour = time.getHours();
  let saludo = "Buenas noches"; // por defecto
  if (hour >= 6 && hour < 12) saludo = "Buenos días";
  else if (hour >= 12 && hour < 18) saludo = "Buenas tardes";

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">{saludo}</h1>
      <h1>Bienvenida a CactRoom</h1>
      <h2 className="dashboard-clock">{timeString}</h2>
    </div>
  );
};

export default DashboardPage;

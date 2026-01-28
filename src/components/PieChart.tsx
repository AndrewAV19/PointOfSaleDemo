import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title = "Productos Más Vendidos",
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 14,
            family: "Inter, sans-serif",
          },
          color: "#333",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e0e0e0",
        borderWidth: 1,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
      {/* Título de la gráfica */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

      {/* Contenedor de la gráfica */}
      <div className="w-full h-96">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;

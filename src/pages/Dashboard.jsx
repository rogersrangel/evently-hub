import { useState } from 'react';

export default function Dashboard() {
  // Simulando dados que viriam do banco de dados
  const [agendamentos] = useState([
    { id: 1, cliente: "Ana Silva", data: "15/02/2026", tipo: "Casamento", status: "Confirmado" },
    { id: 2, cliente: "Marcos Rocha", data: "20/02/2026", tipo: "Aniversário", status: "Pendente" },
    { id: 3, cliente: "Carla Souza", data: "10/03/2026", tipo: "Corporativo", status: "Confirmado" },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel do Fornecedor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Mini cards de resumo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total de Reservas</p>
          <p className="text-3xl font-bold text-indigo-600">{agendamentos.length}</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Cliente</th>
              <th className="p-4 font-semibold text-gray-600">Data</th>
              <th className="p-4 font-semibold text-gray-600">Tipo</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* O MAP varre a lista e cria uma linha (tr) para cada item */}
            {agendamentos.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 text-gray-800 font-medium">{item.cliente}</td>
                <td className="p-4 text-gray-600">{item.data}</td>
                <td className="p-4 text-gray-600">{item.tipo}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
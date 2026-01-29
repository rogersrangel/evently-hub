import { useState } from 'react'; // Hook para o React "lembrar" o que digitamos

export default function RegisterService() {
  // Criamos um estado para o formulário. 
  // O React começa com esses campos vazios.
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'buffet'
  });

  // Essa função roda toda vez que você digita algo
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Atualizamos o estado mantendo o que já tinha (...formData) 
    // e trocando apenas o campo que mudou [name]
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-4">Cadastro de Fornecedor</h2>
      
      <div className="space-y-4">
        {/* Campo Nome */}
        <input
          name="nome"
          placeholder="Nome do seu negócio"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />

        {/* Campo Tipo */}
        <select 
          name="tipo" 
          className="w-full p-2 border rounded"
          onChange={handleChange}
        >
          <option value="buffet">Buffet</option>
          <option value="espaco">Espaço de Eventos</option>
        </select>

        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Cadastrar
        </button>
      </div>

      {/* Visualização para aprendizado: mostra o dado mudando no código */}
      <p className="mt-4 text-sm text-gray-500">
        Digitando agora: {formData.nome} ({formData.tipo})
      </p>
    </div>
  );
}
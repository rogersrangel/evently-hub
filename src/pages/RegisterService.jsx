import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // A ponte para o banco

export default function RegisterService() {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'buffet',
    imagens: [] // Agora temos uma lista de imagens vazia
  });

  const [currentImg, setCurrentImg] = useState(''); // Guarda o link que está sendo digitado agora

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para adicionar imagem na lista
  const addImage = () => {
    if (currentImg.trim() !== "") {
      setFormData({
        ...formData,
        imagens: [...formData.imagens, currentImg] // Pega as fotos que já tinha e adiciona a nova
      });
      setCurrentImg(''); // Limpa o campo de digitar após adicionar
    }
  };

  // Função para remover uma imagem específica
  const removeImage = (indexToRemove) => {
    setFormData({
      ...formData,
      imagens: formData.imagens.filter((_, index) => index !== indexToRemove)
    });
  };

const handleSalvar = async () => {
  if (!supabase) {
    alert("Erro: Conexão com o banco não configurada corretamente.");
    return;
  }

  const { data, error } = await supabase
    .from('fornecedores')
    .insert([
      { 
        nome: formData.nome, 
        tipo: formData.tipo, 
        preco: parseFloat(formData.preco) || 0, // Garante que é número
        imagens: formData.imagens 
      }
    ]);

  if (error) {
    alert("Erro ao salvar: " + error.message);
  } else {
    alert("Perfil publicado com sucesso!");
    // Limpa o formulário após salvar
    setFormData({ nome: '', tipo: 'buffet', imagens: [] });
  }
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-sm rounded-2xl mt-10 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Meu Portfólio</h2>
      
      <div className="space-y-6">
        {/* Campo Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Negócio</label>
          <input
            name="nome"
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={handleChange}
            placeholder="Ex: Buffet Mágico"
          />
        </div>

        {/* Seção de Imagens */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar Fotos (URL)</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg outline-none focus:border-indigo-500"
              placeholder="Cole o link da foto aqui..."
              value={currentImg}
              onChange={(e) => setCurrentImg(e.target.value)}
            />
            <button 
              type="button"
              onClick={addImage}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Adicionar
            </button>
          </div>

          {/* Galeria de Miniaturas (Preview) */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {formData.imagens.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt="Preview" 
                  className="h-24 w-full object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
  onClick={handleSalvar} // Chama a função que criamos acima
  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
>
  Finalizar e Publicar Perfil
</button>
      </div>
    </div>
  );
}
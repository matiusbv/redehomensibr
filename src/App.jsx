import { useState } from 'react'
import { db } from './firebaseConnection'
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import './App.css';
import leftImage from './assets/ibr.png'
import rightImage from './assets/rede.png'




function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState('')
 
  async function handleAdd() {
    await addDoc(collection(db, "Cadastro"), {
      nome: nome,
      telefone: telefone,
    })
    .then (() => {
      console.log("CADASTRO COM SUCESSO")
      setNome('');
      setTelefone('')
    })
    .catch((error) => {
      console.log("ERRO " + error)
    })
  }

  async function buscarPost() {
    const postsRef = collection(db, "Cadastro")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nome: doc.data().nome,
          telefone: doc.data().telefone,
        })
      })
      setPosts(lista);
    })
    .catch((error) => {
      console.log("Deu Algum erro ao buscar")
    })
  }

  function editarPost() {
    alert("oi")
  }

  return (
    <div>
        <div className="header">
      <img src={leftImage} alt="Imagem Esquerda" className="image-side" />
      <h1>Rede de Homens</h1>
      <img src={rightImage} alt="Imagem Direita" className="image-side" />
    </div>

  <div className="container">
    {/* <label>Id do Post</label>
    <input 
      placeholder='Digite o ID do post'
      value={idPost}
      onChange={(e) => setIdPost(e.target.value)}
    /><br/><br/> */}

    <label>nome:</label>
    <textarea 
      type="text"
      placeholder='Digite o nome'
      value={nome}
      onChange={ (e) => setNome(e.target.value) }
    />

    <label>telefone:</label>
    <input 
      type="text" 
      placeholder="telefone do post"
      value={telefone}
      onChange={(e) => setTelefone(e.target.value) }
    />

    <button onClick={handleAdd}>Cadastrar</button>
    <button onClick={buscarPost}>Buscar Posts</button>
    {/* <button onClick={editarPost}>Atualizar post</button> */}

    <ul>
      {posts.map( (post) => {
        return(
          <li key={post.id}>
         
            <span>Nome: {post.nome}</span>
            <span>Telefone: {post.telefone}</span>
          </li>
        )
      } )}
    </ul>

  </div>

  </div>
  );
}

export default App;

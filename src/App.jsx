import { useState, useEffect } from 'react'
import { db, auth } from './firebaseConnection'
import { 
  doc, 
  setDoc, 
  collection,
  addDoc,
  getDoc,
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot 
  } from 'firebase/firestore'
import './App.css';
import leftImage from './assets/ibr.png'
import rightImage from './assets/rede.png'

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';


function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState('')

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "Cadastro"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            nome: doc.data().nome,
            telefone: doc.data().telefone,
          })
        })
        setPosts(listaPost);
      })
    }
    loadPosts()
  }, [])

  useEffect(() => {
    async function checkLogin() {
        onAuthStateChanged(auth, (user) => {
          if(user) {
            console.log(user);
            setUser(true);
            setUserDetail({
              uid: user.id,
              email: user.email
            })
          }else {
            setUser(false)
            setUserDetail({})
          }
        })
    }
    checkLogin()
  }, [])
 
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

 async function excluirPost(id) {
    const docRef = doc(db, "Cadastro", id)
    await deleteDoc(docRef)
    .then(() => {
      alert("Nome deletado com sucesso!")
    })
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      console.log("CADASTRADO COM SUCESSO!")
    
      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      
      if(error.code === 'auth/weak-password'){
        alert("Senha muito fraca.")
      }else if(error.code === 'auth/email-already-in-use'){
        alert("Email já existe!")
      }

    })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("User Logado com sucesso")
      console.log(value.user)

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch (() => {
      console.log("Erro ao fazer login")
    })
  }

  async function fazerLogout() {
   await signOut(auth)
   setUser(false)
   setUserDetail({})
  }

  return (
    <div>
        <div className="header">
      <img src={leftImage} alt="Imagem Esquerda" className="image-side" />
      <h1>Rede de Homens</h1>
      <img src={rightImage} alt="Imagem Direita" className="image-side" />
    </div>

    <div className='container'>
    {user && (
      <div>
        <strong>Seja bem-vindo(a)</strong><br/>
        <span> Email: {userDetail.email}</span><br/>
        <button onClick={fazerLogout}>Sair da conta</button>
      </div>
    )}
     
      <label>Email</label>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Digite um email'
      /> <br/>
            <label>Senha</label>
      <input 
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder='Digite a senha'
      /> <br/>
      {/* <button onClick={novoUsuario}>Cadastrar</button> */}
      <button onClick={logarUsuario}>Fazer Login</button>
    </div>

  <div className="container">
    {/* <label>Id do Post</label>
    <input 
      placeholder='Digite o ID do post'
      value={idPost}
      onChange={(e) => setIdPost(e.target.value)}
    /><br/><br/> */}
  {user ? (
    <div>
      <h2>Visitantes</h2>
      <label>Nome:</label>
      <textarea 
        type="text"
        placeholder="Digite o nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <label>Telefone:</label>
      <input 
        type="text" 
        placeholder="Digite o telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />

      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={buscarPost}>Buscar Posts</button>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <span>Nome: {post.nome}</span>
            <span>Telefone: {post.telefone}</span>
            <button onClick={() => excluirPost(post.id)}>Excluir</button><br/>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Por favor, faça login para acessar o cadastro de visitantes.</p>
  )}
</div>

  </div>


  );
}

export default App;

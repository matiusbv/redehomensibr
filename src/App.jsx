import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection';
import { 
  doc, 
  collection,
  addDoc,
  getDocs, 
  deleteDoc,
  onSnapshot 
} from 'firebase/firestore';
import './App.css';
import leftImage from './assets/ibr.png';
import rightImage from './assets/rede.png';

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [evangelico, setEvangelico] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [showVisitors, setShowVisitors] = useState(false); // Estado para controlar a exibição da lista

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
        } else {
          setUser(false);
          setUserDetail({});
        }
      });
    }
    checkLogin();
  }, []);

  async function handleAdd() {
    await addDoc(collection(db, 'Cadastro'), {
      nome: nome,
      telefone: telefone,
      nascimento: nascimento,
      evangelico: evangelico,
    })
    .then(() => {
      setNome('');
      setTelefone('');
      setNascimento('');
      setEvangelico('');
    })
    .catch((error) => {
      console.log('ERRO ' + error);
    });
  }

  async function buscarPost() {
    if (!showVisitors) { // Só busca os posts se a lista não estiver visível
      const postsRef = collection(db, 'Cadastro');
      await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nome: doc.data().nome,
            telefone: doc.data().telefone,
            nascimento: doc.data().nascimento,
            evangelico: doc.data().evangelico,
          });
        });
        setPosts(lista);
      })
      .catch((error) => {
        console.log('Deu algum erro ao buscar');
      });
    }
    setShowVisitors(!showVisitors); // Alterna a exibição da lista
  }

  async function excluirPost(id) {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este nome?');
    
    if (confirmDelete) {
      const docRef = doc(db, 'Cadastro', id);
      await deleteDoc(docRef)
        .then(() => {
          alert('Nome deletado com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao deletar:', error);
        });
    } else {
      console.log('Ação de exclusão cancelada');
    }
  }
  

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      });
      setUser(true);
      setEmail('');
      setSenha('');
    })
    .catch(() => {
      console.log('Erro ao fazer login');
    });
  }

  async function fazerLogout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }

  // Verifica se todos os campos estão preenchidos
  const areFieldsFilled = nome && telefone && nascimento && evangelico;

  return (
    <div>
      <div className="header">
        <img src={leftImage} alt="Imagem Esquerda" className="image-side" />
        <h1>Rede de Homens</h1>
        <img src={rightImage} alt="Imagem Direita" className="image-side" />
      </div>

      <div className="container">
        {user && (
          <div>
            <strong>Seja bem-vindo(a)</strong><br/>
            <span>Email: {userDetail.email}</span><br/>
            <button onClick={fazerLogout}>Sair da conta</button>
          </div>
        )}

        <label>Email</label>
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um email"
          required
        /> <br/>
        <label>Senha</label>
        <input 
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite a senha"
          required
        /> <br/>
        <button onClick={logarUsuario}>Fazer Login</button>
      </div>

      {user ? (
        <div className="container">
          <h2>Visitantes</h2>
          <label>Nome:</label>
          <textarea 
            type="text"
            placeholder="Digite o nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>Telefone:</label>
          <input 
            type="text" 
            placeholder="Digite o telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />

          <label>Data Nascimento:</label>
          <input 
            type="text" 
            placeholder="Digite a data de nascimento"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            required
          />

          <label>É Evangélico?:</label>
          <input 
            type="text" 
            placeholder="Digite Sim ou Não"
            value={evangelico}
            onChange={(e) => setEvangelico(e.target.value)}
            required
          />

          {/* Só exibe o botão de "Cadastrar" se todos os campos estiverem preenchidos */}
          {areFieldsFilled && (
            <button onClick={handleAdd}>Cadastrar</button>
          )}

          <button onClick={buscarPost}>
            {showVisitors ? 'Ocultar Visitantes' : 'Listar Visitantes'}
          </button>

          {showVisitors && (
  <ul>
    {posts.map((post) => (
      <li key={post.id} className="post-item">
        <div className="containerNomes">
          <span>Nome: {post.nome}</span>
          <span>Telefone: {post.telefone}</span>
          <span>Nascimento: {post.nascimento}</span>
          <span>Evangélico: {post.evangelico}</span>
        </div>
        <button className="delete-button" onClick={() => excluirPost(post.id)}>Excluir</button>
      </li>
    ))}
  </ul>
)}


        </div>
      ) : (
        <p>Por favor, faça login para acessar o cadastro de visitantes.</p>
      )}
    </div>
  );
}

export default App;

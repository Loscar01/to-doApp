// Importamos las librerías necesarias
import { createContext, useContext, useState } from "react";
import { supabase } from "../server/server";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import Swal from 'sweetalert2'

// Creamos un contexto para las tareas
export const UserContext = createContext();

// Hook personalizado para acceder a los valores del contexto
export const UseTask = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useTask necesita el TaskContextProvider");
  return context;
};

// Proveedor del contexto para TaskContext
export const UserContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(false);
    const [tasks, setTasks] = useState([])

    useEffect(() => {
      const checkUser = async () => {
        const user = supabase.auth.getUser();
        setIsLogin(user !== null);
      };
  
      checkUser();
    }, []);
  const createUser = async (registrationValues) =>{
    try {
      const { data, error } = await supabase.auth.signUp(
        {
          email: registrationValues.email,
          password: registrationValues.password,
          options: {
            data: {
              user_name: registrationValues.firstName,
            }
          }
        }
      )
        if (error) {
            alert("El correo introducido ya existe o hubo muchos intentos")
            console.log("CORREO EXISTENTE: ", error)
        }else{
            alert("Registro exitoso: ", data)
            navigate('/home')
        }
    } catch (error) {
        console.log("Lo sentimos, ha ocurrido un error, consulta la consola de comandos para más informacion")
        console.log("Error interno: ", error)
    }
  }

  

  
  const logIn = async (loginValues) =>{
    try {  
        const { error } = await supabase.auth.signInWithPassword({
            email: loginValues.email,
            password: loginValues.password,
          })
        if (error) {
            alert("Usuario o contraseña incorrecta")
            
        }else{
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Hola, que gusto volver a verte :)`,
            showConfirmButton: false,
            timer: 1000
          });
            navigate('/home')
            setIsLogin(true)
        }
    } catch (error) {
        console.log("Lo sentimos, ha ocurrido un error, consulta la consola de comandos para más informacion")
        console.log("Error interno: ", error)
    }
  }

  const logOut = async() => {
    try { 
    const { error } = await supabase.auth.signOut()
    setIsLogin(false)
    navigate('/')
    if (error) {
      alert("Error al cerrar la sesión, visita la consola de comandos para mas información")
      console.log("Error: ", error)
      navigate('/')
    }else{
      navigate("/")
    }
    } catch (error) {
      alert("Error, visita la consola de comandos para mas información")
      console.log("Error al salir de la sesión: ", error)
    }
  }

  const createTask = async(taskValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
      .from('tasks')
      .insert({ title: taskValues.title, description: taskValues.content, userId: user.id })
      if (error) {
        console.log("Error: ", error)
      }else{
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tu tarea quedo guardada",
          showConfirmButton: false,
          timer: 800
        });
        taskValues.title = ""
        taskValues.content = ""
        fetchTasks()
      }
    } catch (error) {
        console.log("Error: ", error)
    }
  }

  const fetchTasks = async() => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
      .from('tasks')
      .select()
      .eq("userId", user.id)
      if (error) {
        console.log("Error: ", error)
      }else{
        setTasks(data)
      }
    } catch (error) {
        console.log("Error: ", error)
    }
  }

  const deleteTasks = async (deleteId)=>{
    const { data: { user } } = await supabase.auth.getUser()

       try {
        const {error} = await supabase
        .from('tasks')
        .delete()
        .eq('userId', user.id )
        .eq("id", deleteId)
        if (error) {
            alert("No fue posible eliminar la tarea: ", error)
        }else{
          
            fetchTasks()
        }
       } catch (error) {
        console.log(error)
       }
    }
    const updateTasks = async(taskData) =>{
      try {
      const { error } = await supabase
      .from('tasks')
      .update({ title: taskData.title, description: taskData.content })
      .eq('id', taskData.id)
      if (error) {
        alert("No fue posible actualizar la tarea")
      }else{
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tarea Actualizada",
          showConfirmButton: false,
          timer: 700
        });
        fetchTasks()
      }
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <UserContext.Provider
      value={{createUser, logIn, logOut, isLogin, createTask, tasks, fetchTasks, deleteTasks, updateTasks}}
    >
      {children}
    </UserContext.Provider>
  );
};

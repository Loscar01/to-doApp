import React, { useState, useEffect } from 'react';
import { UseTask } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../server/server';
import Swal from "sweetalert2"

import "./css/home.css";

function Home() {
  const navigate = useNavigate();
  
  const { isLogin, logOut, createTask, tasks, fetchTasks, deleteTasks, updateTasks } = UseTask();

  const [taskValue, setTaskValues] = useState({
    title: "",
    content: ""
  });
  const [editingTask, setEditingTask] = useState(null);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setTaskValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateTask();
    } else if (taskValue.title.length < 1 || taskValue.content.length < 1 ) {
      
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "El titulo o el contenido no puede estar vacio",
          showConfirmButton: true,
          timer: 1500
        });

      
    }else{
      createTask(taskValue);
    }
  }

  const updateTask = () => {
    if (editingTask) {
      
      updateTasks({ ...taskValue, id: editingTask.id });
      setEditingTask(null);
      taskValue.title = "";
      taskValue.content = "";
    }
  }

  const handleLogOut = async () => {
    await logOut();
    navigate('/');
  };

  useEffect(() => {
    const retrieveSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.log("Error al obtener la sesión: ", error)
        } else if (data.session === null) {
          navigate('/');
        } else {
          fetchTasks();
        }
      } catch (error) {
        console.error("Error al recuperar la sesión: ", error);
      }
    }
  
    retrieveSession();
  }, [navigate]);

  const handleDelete = (deleteId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: "Estas seguro?",
      text: "Esta nota desaparecerá de aquí!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Eliminado!",
          text: "Tu nota fue eliminada",
          icon: "success"
        });
        deleteTasks(deleteId);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Operacion Cancelada",
          icon: "error"
        });
      }
    });
    
  }

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskValues({
      title: task.title,
      content: task.description
    });
  }
  const cancelEdit = () => {
    setTaskValues({ title: "", content: "" });
    setEditingTask(null);
  }

  return (
    <>
      <nav>
        <ul>
          <li>{isLogin && <button onClick={handleLogOut} className='btn__nav' > Cerrar sesión</button>}</li>
          <li><button onClick={()=> navigate('/home')} className='btn__nav'>Home</button></li>
          <li><button onClick={()=> navigate('/about')} className='btn__nav'>About me</button></li>
          <li><button onClick={()=> navigate('/account')} className='btn__nav'>My Account</button></li>
        </ul>
      </nav>
      <div className='container__tasks'>
        <div className="container__form-tasks">
          <form className='task__form' onSubmit={handleSubmitTask}>
            <label className='task__form-title'>{editingTask ? 'Editar tarea' : 'Añadir una tarea'}</label>
            <label className='task__form-label'>
              Titulo
              <input
                type="text"
                name="title"
                value={taskValue.title}
                onChange={handleInput}
                placeholder="Mi tarea"
                className='task__input'
              />
            </label>
            <label className='task__form-label'>
              Descripcion
              <textarea
                type="text"
                name="content"
                value={taskValue.content}
                onChange={handleInput}
                placeholder="Descripcion de la tarea"
                className='task__input-textarea'
              />
            </label>
            <div className='btn__login-container'>
              <button type="submit" className='login-btn'>
                {editingTask ? 'Actualizar Tarea' : 'Guardar Tarea'}
              </button>
            </div>
          </form>
        </div>
        <div className='task__list'>
          {tasks.map((task, index) => (
            <div key={task.id} className='taskItem'>
              <span className='task__id'>#{index + 1}</span><br />
              <span className='task__title'>{task.title}</span>
              <p className='task__content'>{task.description}</p>
              <button onClick={() => handleDelete(task.id)} className='btn__delete'>Eliminar</button>
              <button onClick={() => editingTask ? cancelEdit() : handleEdit(task)} className='btn__edit'>{editingTask ? 'Cancelar' : 'Editar'}</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;

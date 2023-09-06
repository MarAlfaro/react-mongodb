import React, { useState, useEffect } from 'react';
import api from './api'; // Importa el archivo de configuración de Axios

const Controlado = () => {
  // Estado para almacenar los datos de una tarea
  const [todo, setTodo] = useState({
    todoNombre: '',
    todoDescripcion: '',
    todoEstado: 'pendiente',
  });

  // Estado para almacenar la lista de tareas
  const [todoList, setTodoList] = useState([]);

  // Estado para almacenar la tarea seleccionada para edición
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  // Estado para contar tareas completadas (inicializado en 0)
  const [tareasCompletadas, setTareasCompletadas] = useState(0);

  // Estado para contar tareas pendientes (inicializado en 0)
  const [tareasPendientes, setTareasPendientes] = useState(0);

  useEffect(() => {
    // Cargar tareas desde el servidor al iniciar el componente
    api.get('/api/tasks')
      .then((response) => {
        setTodoList(response.data);

        // Contar tareas completadas y pendientes en la lista cargada
        const completadas = response.data.filter((task) => task.todoEstado === 'completado');
        const pendientes = response.data.filter((task) => task.todoEstado === 'pendiente');

        setTareasCompletadas(completadas.length);
        setTareasPendientes(pendientes.length);
      })
      .catch((error) => {
        console.error('Error al obtener tareas:', error);
      });
  }, []);

  const handleEditClick = (task) => {
    setTareaSeleccionada(task);
    setTodo(task); // Cargar los valores de la tarea en el formulario
  };

  const handleDeleteClick = (taskToDelete) => {
    // Eliminar una tarea
    api.delete(`api/tasks/${taskToDelete._id}`)
      .then(() => {
        // Actualizar el estado de las tareas en el cliente
        const updatedTodoList = todoList.filter((task) => task._id !== taskToDelete._id);
        setTodoList(updatedTodoList);

        // Actualizar los estados de tareas completadas y pendientes en respuesta a la eliminación
        const completadas = updatedTodoList.filter((task) => task.todoEstado === 'completado');
        const pendientes = updatedTodoList.filter((task) => task.todoEstado === 'pendiente');

        setTareasCompletadas(completadas.length);
        setTareasPendientes(pendientes.length);
      })
      .catch((error) => {
        console.error('Error al eliminar tarea:', error);
      });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (tareaSeleccionada) {
      // Actualizar una tarea existente
      api
        .put(`api/tasks/${tareaSeleccionada._id}`, todo)
        .then((response) => {
          // Copia el estado actual de todoList en una variable temporal
          const tempTodoList = [...todoList];
          // Actualiza la tarea modificada o reemplaza la tarea existente
          const index = tempTodoList.findIndex((task) => task._id === tareaSeleccionada._id);
          if (index !== -1) {
            tempTodoList[index] = response.data;
          }
          // Actualiza el estado de todoList con la nueva lista
          setTodoList(tempTodoList);
          setTareaSeleccionada(null); // Limpiar la tarea seleccionada
  
          // Recalcular los estados de tareas completadas y pendientes
          const completadas = tempTodoList.filter(
            (task) => task.todoEstado === "completado"
          ).length;
          const pendientes = tempTodoList.filter(
            (task) => task.todoEstado === "pendiente"
          ).length;
          setTareasCompletadas(completadas);
          setTareasPendientes(pendientes);
        })
        .catch((error) => {
          console.error("Error al actualizar tarea:", error);
        });
    } else {
// Agregar una nueva tarea
api
  .post("/api/tasks/create", todo)
  .then((response) => {
    // Agregar la nueva tarea al estado del cliente
    setTodoList([...todoList, response.data]);

    // Recalcular los estados de tareas completadas y pendientes después de agregar
    const completadas = [...todoList, response.data].filter(
      (task) => task.todoEstado === "completado"
    ).length;
    const pendientes = [...todoList, response.data].filter(
      (task) => task.todoEstado === "pendiente"
    ).length;
    setTareasCompletadas(completadas);
    setTareasPendientes(pendientes);
  })
  .catch((error) => {
    console.error("Error al agregar tarea:", error);
  });

    }
    // Limpiar los campos del formulario después de agregar o actualizar
    setTodo({
      todoNombre: "",
      todoDescripcion: "",
      todoEstado: "pendiente",
    });
  };
  
   
  
  
  

  const handleOnChange = (e) => {
    setTodo((todo) => ({
      ...todo,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="Container">
      <div className="row">
        <div className="col-sm-6">
          <h2 className="text-info">Formulario Controlado</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Ingrese un TODO"
              name="todoNombre"
              value={todo.todoNombre}
              onChange={handleOnChange}
              required
            />
            <textarea
              className="form-control mb-2"
              type="text"
              placeholder="Ingrese Descripción"
              name="todoDescripcion"
              value={todo.todoDescripcion}
              onChange={handleOnChange}
              required
            />
            <select
              className="form-select mb-2"
              name="todoEstado"
              value={todo.todoEstado}
              onChange={handleOnChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="completado">Completado</option>
            </select>
            <button className="btn btn-info" type="submit">
              {tareaSeleccionada ? "Actualizar" : "Agregar"}
            </button>
          </form>
          <br></br>
        </div>
        {/* Lista de las Tareas que se van a ir almacenando*/}
        <div className="col-sm-6">
          <h4 className="text-info text-center">Tareas</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {todoList.map((task, index) => (
                <tr key={index}>
                  <td>{task.todoNombre}</td>
                  <td>{task.todoDescripcion}</td>
                  <td>{task.todoEstado}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm mx-3"
                      onClick={() => handleEditClick(task)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(task)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">Tareas Completadas {tareasCompletadas}</th>
                <th className="text-center">Tareas Pendientes {tareasPendientes}</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Controlado;

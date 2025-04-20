
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { GrView } from "react-icons/gr";


function App() {
  const [productos,setProductos]=useState([]);
  const [busqueda,SetBusqueda]=useState('');
  const [formularioAgregar,SetAgregarProducto]=useState({
    nombre:'',
    nacionalidad:'',
    fecha_nacimiento:'',
    biografia:''
  });
  const [formularioEditar,SetEditarProducto]=useState({
    nombre:'',
    nacionalidad:'',
    fecha_nacimiento:'',
    biografia:''
  });
  const [productoId,SetProductoId]=useState(0);

  const [mostrar, setMostrar] = useState(false);
  const CerrarModal = () => setMostrar(false);
  const AbrirModal = () => setMostrar(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [libros,SetLibros]=useState([]);
  
  const [viewLib, Setview] = useState(false);
  const CerrarVentana = () => Setview(false);
  const AbrirVentana = () => Setview(true);

  const fetchProductos = useCallback(async () => {
    try {
      const respuesta = await fetch('https://app-b15e1f3f-0682-425a-b1b0-848a44cc52a9.cleverapps.io/api/autores');
      const data = await respuesta.json();
      setProductos(data);
    } catch (error) {
      alert('ERROR' + error);
    }
  },[]);
  useEffect(()=>{
    fetchProductos();
  },[fetchProductos]);
  const Agregar=async(e)=>{
    e.preventDefault();
    if(!formularioAgregar.nombre.trim()){
      alert('Nombre requerido');
      return;
    }
    try{
     const respuesta=await fetch(`https://app-b15e1f3f-0682-425a-b1b0-848a44cc52a9.cleverapps.io/api/autores`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          ...formularioAgregar
        })
      });
      if(!respuesta.ok){
        let errorMensaje='Error al cargar';
        try{
          const error=await respuesta.json();
          errorMensaje=error.message || errorMensaje
        }catch(error){
          console.error(errorMensaje);
        }
        throw new Error(errorMensaje);
      }
      handleClose();
      Swal.fire({
        title: "!Se agrego correctamente el autor!",
        icon: "success",
        draggable: true,
        timer:2000
      });
      
      fetchProductos();
      SetAgregarProducto({
        nombre:'',
        nacionalidad:'',
        fecha_nacimiento:'',
        biografia:''
      })
      

    }catch(error){
      console.error(error);
      Swal.fire({
        title: "!No se pudo agregar el nuevo autor!",
        icon: "error",
        draggable: true,
        timer:2000
      });
    }

  }
  const cambiosFormularioEditar=(e)=>{
    SetEditarProducto({
      ...formularioEditar,
      [e.target.name]:e.target.value
    });
  }
  const EditarProductos=(producto)=>{
    SetEditarProducto({
      nombre:producto.nombre,
      nacionalidad:producto.nacionalidad,
      fecha_nacimiento:producto.fecha_nacimiento,
      biografia:producto.biografia
    });
    
    SetProductoId(producto.id_autor);
    AbrirModal();
  }
  const EditarProducto=async(e)=>{
   
    e.preventDefault();
    if(!formularioEditar.nombre.trim()){
      alert('Nombre requerido');
      return;
    }
    try{
     const respuesta=await fetch(`https://app-b15e1f3f-0682-425a-b1b0-848a44cc52a9.cleverapps.io/api/autores/${productoId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          ...formularioEditar
        })
      });
     
      if(!respuesta.ok){
        let errorMensaje='Error al cargar';
        try{
          const error=await respuesta.json();
          errorMensaje=error.message || errorMensaje
        }catch(error){
          console.error(errorMensaje);
        }
        throw new Error(errorMensaje);
      }
      CerrarModal();
      Swal.fire({
        title: "!Se edito correctamente el Producto!",
        icon: "success",
        draggable: true,
        timer:2000
      });
      fetchProductos();

    }catch(error){
      console.error(error);
      Swal.fire({
        title: "!No se pudo editar el nuevo producto!",
        icon: "error",
        draggable: true,
        timer:2000
      });
    }
  }
  const cambiosFormularioAgregar=async(e)=>{
    SetAgregarProducto({
      ...formularioAgregar,
      [e.target.name]:e.target.value
    })

  }
  const EliminarProducto=async(id)=>{
    Swal.fire({
      title: "¿Estas seguro de que deseas eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Si, Eliminar!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        try{
          await fetch(`https://app-b15e1f3f-0682-425a-b1b0-848a44cc52a9.cleverapps.io/api/autores/${id}`,{
            method:`DELETE`
          });
          Swal.fire({
            title: "Autor Eliminado Correctamente!",
            icon: "success",
            timer:2000
          });
          fetchProductos();
        }catch(error){
          Swal.fire({
            title: "¡No se pudo eliminar el autor",
            icon: "success",
            timer:2000
          });
        }
        
      }
    });
   }
   
   const VerLibros=async(id)=>{
      try{
         const respuesta=await fetch(`https://app-b15e1f3f-0682-425a-b1b0-848a44cc52a9.cleverapps.io/api/autores/${id}`);
         const data = await respuesta.json();
         SetLibros(data);
         AbrirVentana();
      }catch(error){
        Swal.fire({
          title: "¡No se pudo obtener los libros",
          icon: "success",
          timer:2000
        });
      }
    }
  const columnas=[
    {
      name:'ID',
      selector: row=>row.id_autor,
      sortable:true
    },
    {
      name:'Nombre',
      selector:row=>row.nombre,
      sortable:true
    },
    {
      name:'Nacionalidad',
      selector:row=>row.nacionalidad,
      sortable:true
    },
    {
      name:'Fecha_nacimiento',
      selector:row=>row.fecha_nacimiento,
      sortable:true
    },
    {
      name:'Biografia',
      selector:row=>row.biografia,
      sortable:true
    },
    {
      name:'Acciones',
      cell:row=>(
        <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-warning"  onClick={()=>{EditarProductos(row)}}><CiEdit /></button>
              <button type="button" className="btn btn-danger" onClick={()=>{EliminarProducto(row.id_autor)}}><MdDeleteForever /></button>       
              <button type="button" className="btn btn-success" onClick={()=>{VerLibros(row.id_autor)}}><GrView /></button>       
      </div>
            
    )
    }
   ];
   const PaginacionOpciones={
    rowsPerPageText:'Filas por pagina'
  };
  
  return (
    <div className='Errores'>
      <div style={{margin:'30px 0px'}}>
       <Button variant="primary" onClick={handleShow}>Crear</Button>
      </div>  
      <Form.Control
        type='text'
        placeholder='Buscar autor'
        className='mb-3'
        value={busqueda}
        onChange={(e)=>{SetBusqueda(e.target.value)}}
       />

       <DataTable
        columns={columnas}
        data={productos.filter(producto=>
          producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )}
        pagination
        highlightOnHover
        striped
        paginationComponentOptions={PaginacionOpciones}
       />


        {/*Modal para Agregar nuevo producto*/}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name='nombre'
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.nombre}
              />
              
              <Form.Label>Nacionalidad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la nacionalidad"
                name='nacionalidad'
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.nacionalidad}
              />
              <Form.Label>fecha_nacimiento</Form.Label>
              <Form.Control
                type="date"
                placeholder="Ingrese la fecha_nacimiento"
                name='fecha_nacimiento'
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.fecha_nacimiento}
              />
              <Form.Label>Biografia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la biografia"
                name='biografia'
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.biografia}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={Agregar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      {/*Modal para Editar*/}
      <Modal show={mostrar} onHide={CerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name='nombre'
                onChange={cambiosFormularioEditar}
                value={formularioEditar.nombre}
              />
              <Form.Label>Nacionalidad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nacionalidad"
                name='nacionalidad'
                onChange={cambiosFormularioEditar}
                value={formularioEditar.nacionalidad}
              />
              <Form.Label>fecha_nacimiento</Form.Label>
              <Form.Control
                type="date"
                placeholder="Ingrese el nombre"
                name='fecha_nacimiento'
                onChange={cambiosFormularioEditar}
                value={formularioEditar.fecha_nacimiento}
              />
               <Form.Label>Biografia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name='biografia'
                onChange={cambiosFormularioEditar}
                value={formularioEditar.biografia}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CerrarModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={EditarProducto}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={viewLib} onHide={CerrarVentana}>
        <Modal.Header closeButton>
          <Modal.Title>Libros del autor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            {libros.length > 0 ? (
              libros.map((libro) => (
                <ol key={libro.id_libro}>
                  <li>
                    <strong>Título:</strong> {libro.titulo}
                  </li>
                  <li>
                    <strong>Año de publicación:</strong> {libro.año_publicacion}
                  </li>
                  <li>
                    <strong>Género:</strong> {libro.genero}
                  </li>
                  <li>
                    <strong>Resumen:</strong> {libro.resumen}
                  </li>
                </ol>
              ))
          ):(
            <h7>El autor <strong> no tiene libros</strong></h7>
          )}

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CerrarVentana}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
    
  );
}

export default App;

import React from "react";
import "./BlogManager.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardSubtitle,
  Col,
  Row,
  Alert,
  Input,
} from "reactstrap";

class BlogManager extends React.Component {
  constructor(props) {
    super(props);
    const storedData = JSON.parse(localStorage.getItem("blogs")) || [];
    this.state = {
      data: storedData.length > 0 ? storedData : [
        {
          id: "musica-1",
          categoria: "musica",
          titulo: "Mi primer blog de música",
          contenido: "Este es el contenido de mi primer blog de música.",
          comentarios: [],
        },
        {
          id: "noticias-1",
          categoria: "noticias",
          titulo: "React para principiantes",
          contenido: "Aprende React paso a paso.",
          comentarios: [],
        },
        {
          id: "electronica-1",
          categoria: "electronica",
          titulo: "Consejos de JavaScript",
          contenido: "Trucos útiles para mejorar en JavaScript.",
          comentarios: [],
        },
      ],
      searchQuery: "",
      filterCategory: "",
      modalActualizar: false,
      modalInsertar: false,
      modalEliminar: false,
      modalComentario: false,
      form: { id: "", categoria: "", titulo: "", contenido: "" },
      commentForm: { id: "", contenido: "" },
      editCommentForm: { id: "", contenido: "" },
      editingCommentId: null,
      errorMessage: "",
      blogToComment: null,
      blogToDeleteId: null,
    };
  }

  componentDidUpdate() {
    localStorage.setItem("blogs", JSON.stringify(this.state.data));
  }

  toggleModal = (modalType, blog = null) => {
    this.setState((prevState) => ({
      [modalType]: !prevState[modalType],
      errorMessage: "",
      form: modalType === "modalInsertar" ? { id: "", categoria: "", titulo: "", contenido: "" } : prevState.form,
      blogToComment: modalType === "modalComentario" ? blog : null,
      blogToDeleteId: modalType === "modalEliminar" ? blog?.id : null,
    }));
  };

  handleEdit = () => {
    const updatedData = this.state.data.map((item) =>
      item.id === this.state.form.id ? { ...item, ...this.state.form } : item
    );
    this.setState({ data: updatedData, modalActualizar: false });
  };

  handleDelete = () => {
    const filteredData = this.state.data.filter((item) => item.id !== this.state.blogToDeleteId);
    this.setState({ data: filteredData, modalEliminar: false });
  };

  handleInsert = () => {
    const { categoria, titulo, contenido } = this.state.form;
    if (!categoria || !titulo || !contenido) {
      const error =
        !categoria ? "Por favor, selecciona una categoría." :
        !titulo ? "Por favor, rellena el título." :
        "Por favor, rellena el contenido.";
      this.setState({ errorMessage: error });
      return;
    }

    const newId = `${categoria}-${this.state.data.filter((blog) => blog.categoria === categoria).length + 1}`;
    const newBlog = { id: newId, categoria, titulo, contenido, comentarios: [] };

    this.setState({
      data: [...this.state.data, newBlog],
      modalInsertar: false,
      errorMessage: "",
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      form: { ...prevState.form, [name]: value },
    }));
  };

  handleCommentChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      commentForm: { ...prevState.commentForm, [name]: value },
    }));
  };

  handleAddComment = () => {
    const { blogToComment, commentForm } = this.state;
    if (!commentForm.contenido) {
      this.setState({ errorMessage: "Por favor, escribe un comentario." });
      return;
    }

    const updatedData = this.state.data.map((blog) =>
      blog.id === blogToComment.id
        ? { ...blog, comentarios: [...blog.comentarios, { id: Date.now(), contenido: commentForm.contenido }] }
        : blog
    );

    this.setState({
      data: updatedData,
      blogToComment: {
        ...blogToComment,
        comentarios: [...blogToComment.comentarios, { id: Date.now(), contenido: commentForm.contenido }]
      },
      commentForm: { id: "", contenido: "" },
      errorMessage: "",
    });
  };

  handleDeleteComment = (blogId, commentId) => {
    const updatedData = this.state.data.map((blog) =>
      blog.id === blogId
        ? { ...blog, comentarios: blog.comentarios.filter((comment) => comment.id !== commentId) }
        : blog
    );

    const updatedBlogToComment = {
      ...this.state.blogToComment,
      comentarios: this.state.blogToComment.comentarios.filter((comment) => comment.id !== commentId)
    };

    this.setState({ data: updatedData, blogToComment: updatedBlogToComment });
  };

  toggleEditComment = (comment) => {
    this.setState({
      editCommentForm: { id: comment.id, contenido: comment.contenido },
      editingCommentId: comment.id,
    });
  };

  handleEditCommentChange = (e) => {
    const { value } = e.target;
    this.setState((prevState) => ({
      editCommentForm: { ...prevState.editCommentForm, contenido: value },
    }));
  };

  handleSaveCommentEdit = () => {
    const { blogToComment, editCommentForm, editingCommentId } = this.state;
    const updatedData = this.state.data.map((blog) =>
      blog.id === blogToComment.id
        ? {
            ...blog,
            comentarios: blog.comentarios.map((comment) =>
              comment.id === editingCommentId
                ? { ...comment, contenido: editCommentForm.contenido }
                : comment
            ),
          }
        : blog
    );

    const updatedBlogToComment = {
      ...blogToComment,
      comentarios: blogToComment.comentarios.map((comment) =>
        comment.id === editingCommentId
          ? { ...comment, contenido: editCommentForm.contenido }
          : comment
      )
    };

    this.setState({
      data: updatedData,
      blogToComment: updatedBlogToComment,
      editCommentForm: { id: "", contenido: "" },
      editingCommentId: null,
    });
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleCategoryChange = (e) => {
    this.setState({ filterCategory: e.target.value });
  };

  filterBlogs = () => {
    const { data, searchQuery, filterCategory } = this.state;
    return data.filter((blog) =>
      (blog.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.contenido.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterCategory ? blog.categoria === filterCategory : true)
    );
  };

  render() {
    const {
      modalActualizar,
      modalInsertar,
      modalEliminar,
      modalComentario,
      errorMessage,
      blogToComment,
      searchQuery,
      filterCategory,
    } = this.state;

    const filteredBlogs = this.filterBlogs();

    return (
      <>
        <Container>
          <br />
          <div className="d-flex mb-3">
            <Input
              type="text"
              placeholder="Buscar blogs..."
              value={searchQuery}
              onChange={this.handleSearchChange}
              className="me-2"
            />
            <Input
              type="select"
              value={filterCategory}
              onChange={this.handleCategoryChange}
              className="me-2"
            >
              <option value="">Filtrar por categoría</option>
              <option value="musica">Música</option>
              <option value="noticias">Noticias</option>
              <option value="electronica">Electrónica</option>
              <option value="entretenimiento">Entretenimiento</option>
            </Input>
            <Button className="btn-add" onClick={() => this.toggleModal("modalInsertar")}>Añadir Blog</Button>
          </div>
          <Row>
            {filteredBlogs.map((blog) => (
              <Col md="4" key={blog.id}>
                <Card className="blog-card">
                  <CardBody>
                    <CardTitle tag="h5">{blog.titulo}</CardTitle>
                    <CardSubtitle tag="h6" className="mb-2 text-muted">
                      {blog.categoria}
                    </CardSubtitle>
                    <CardText>{blog.contenido}</CardText>
                    <Button className="btn-edit" onClick={() => this.setState({ form: blog }, () => this.toggleModal("modalActualizar"))}>Editar</Button>
                    <Button className="btn-delete" onClick={() => this.toggleModal("modalEliminar", blog)}>Eliminar</Button>
                    <Button className="btn-comments" onClick={() => this.toggleModal("modalComentario", blog)}>Comentarios</Button>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Modal para Editar e Insertar */}
        <Modal isOpen={modalActualizar || modalInsertar} toggle={() => this.toggleModal(modalActualizar ? "modalActualizar" : "modalInsertar")}>
          <ModalHeader toggle={() => this.toggleModal(modalActualizar ? "modalActualizar" : "modalInsertar")}>
            {modalActualizar ? "Editar Blog" : "Nuevo Blog"}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Categoría</label>
              <Input type="select" name="categoria" onChange={this.handleChange} value={this.state.form.categoria}>
                <option value="">Seleccionar</option>
                <option value="musica">Música</option>
                <option value="noticias">Noticias</option>
                <option value="electronica">Electrónica</option>
                <option value="entretenimiento">Entretenimiento</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <label>Título</label>
              <Input type="text" name="titulo" onChange={this.handleChange} value={this.state.form.titulo} />
            </FormGroup>
            <FormGroup>
              <label>Contenido</label>
              <Input type="textarea" name="contenido" onChange={this.handleChange} value={this.state.form.contenido} />
            </FormGroup>
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
          </ModalBody>
          <ModalFooter>
          <Button className="btn-create" onClick={modalActualizar ? this.handleEdit : this.handleInsert}>
          {modalActualizar ? "Guardar cambios" : "Crear"}
          </Button>{" "}
          <Button className="btn-cancel" onClick={() => this.toggleModal(modalActualizar ? "modalActualizar" : "modalInsertar")}>
          Cancelar
          </Button>
          </ModalFooter>
        </Modal>

        {/* Modal para eliminar */}
        <Modal isOpen={modalEliminar} toggle={() => this.toggleModal("modalEliminar")}>
          <ModalHeader toggle={() => this.toggleModal("modalEliminar")}>Eliminar Blog</ModalHeader>
          <ModalBody>¿Estás seguro de eliminar este blog?</ModalBody>
          <ModalFooter>
          <Button className="modal-btn-delete" onClick={this.handleDelete}>Sí, eliminar</Button>
          <Button className="btn-cancel-delete" onClick={() => this.toggleModal("modalEliminar")}>
          Cancelar
          </Button>
          </ModalFooter>
        </Modal>

        {/* Modal para comentarios */}
        <Modal isOpen={modalComentario} toggle={() => this.toggleModal("modalComentario")}>
          <ModalHeader toggle={() => this.toggleModal("modalComentario")}>Comentarios</ModalHeader>
          <ModalBody>
            {blogToComment &&
              blogToComment.comentarios.map((comment) => (
                <div key={comment.id} className="comment">
                  {this.state.editingCommentId === comment.id ? (
                    <Input
                      type="text"
                      value={this.state.editCommentForm.contenido}
                      onChange={this.handleEditCommentChange}
                    />
                  ) : (
                    <CardText>{comment.contenido}</CardText>
                  )}
                  {this.state.editingCommentId === comment.id ? (
                  <Button className="btn-save-comment" onClick={this.handleSaveCommentEdit}>
                    Guardar
                  </Button>
                  ) : (
                    <Button className="btn-edit-comment" onClick={() => this.toggleEditComment(comment)}>
                    Editar
                    </Button>
                  )}
                  <Button className="btn-delete-comment" onClick={() => this.handleDeleteComment(blogToComment.id, comment.id)}>
                  Eliminar
                  </Button>
                </div>
              ))}
            <Input
              type="textarea"
              name="contenido"
              placeholder="Escribe un comentario"
              value={this.state.commentForm.contenido}
              onChange={this.handleCommentChange}
            />
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
          </ModalBody>
          <ModalFooter>
          <Button className="btn-add-comment" onClick={this.handleAddComment}>
          Añadir Comentario
          </Button>{" "}
          <Button className="modal-btn-cancel" onClick={() => this.toggleModal("modalComentario")}>
          Cerrar
          </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default BlogManager;

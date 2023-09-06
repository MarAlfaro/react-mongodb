const logo = "./src/assets/tarea.png";

const Header = () => {
    return (
        <>
            <h1 className="text-info text-center">Todo List</h1>
            <img className="rounded d-block mx-auto" src={logo} width="100px" height="100px"/>
            <hr></hr>
        </>
    );
}

export default Header;

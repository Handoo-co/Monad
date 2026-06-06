// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title PasaporteOrigen
/// @notice Registra pasaportes de autenticidad para productos fisicos usando hashes de serial.
contract PasaporteOrigen {
    enum Estado {
        Activo,
        Revocado
    }

    struct Producto {
        address emisor;
        bytes32 hashSerial;
        bytes32 hashMetadatos;
        string lineaProducto;
        address duenoActual;
        Estado estado;
        uint256 emitidoEn;
    }

    struct Marca {
        bool autorizada;
        string nombre;
        bytes32 hashMetadatos;
    }

    error SoloAdministrador();
    error MarcaInvalida();
    error NombreMarcaInvalido();
    error MarcaNoAutorizada();
    error HashSerialInvalido();
    error HashMetadatosInvalido();
    error LineaProductoInvalida();
    error SerialYaEmitido();
    error ProductoNoExiste();
    error SoloEmisor();
    error SoloDuenoActual();
    error DuenoInvalido();
    error ProductoYaRevocado();
    error HashMotivoInvalido();

    address public immutable administrador;
    uint256 public ultimoId;

    mapping(address cuentaMarca => Marca marca) public marcas;
    mapping(bytes32 hashSerial => uint256 idProducto) public idPorHashSerial;

    mapping(uint256 idProducto => Producto producto) private productos;

    event MarcaRegistrada(
        address indexed cuentaMarca,
        bool autorizada,
        string nombre,
        bytes32 hashMetadatos
    );
    event ProductoEmitido(
        uint256 indexed id,
        address indexed emisor,
        bytes32 indexed hashSerial,
        bytes32 hashMetadatos,
        string lineaProducto
    );
    event ProductoRevocado(uint256 indexed id, address indexed emisor, bytes32 hashMotivo);
    event ProductoTransferido(
        uint256 indexed id,
        address indexed duenoAnterior,
        address indexed duenoNuevo
    );

    modifier soloAdministrador() {
        if (msg.sender != administrador) revert SoloAdministrador();
        _;
    }

    modifier soloMarcaAutorizada() {
        if (!marcas[msg.sender].autorizada) revert MarcaNoAutorizada();
        _;
    }

    modifier productoExiste(uint256 id) {
        if (id == 0 || id > ultimoId) revert ProductoNoExiste();
        _;
    }

    constructor() {
        administrador = msg.sender;
    }

    /// @notice Autoriza o desautoriza una marca emisora.
    function registrarMarca(
        address cuentaMarca,
        string calldata nombre,
        bytes32 hashMetadatos,
        bool autorizada
    ) external soloAdministrador {
        if (cuentaMarca == address(0)) revert MarcaInvalida();
        if (bytes(nombre).length == 0) revert NombreMarcaInvalido();
        if (autorizada && hashMetadatos == bytes32(0)) revert HashMetadatosInvalido();

        marcas[cuentaMarca] = Marca({
            autorizada: autorizada,
            nombre: nombre,
            hashMetadatos: hashMetadatos
        });

        emit MarcaRegistrada(cuentaMarca, autorizada, nombre, hashMetadatos);
    }

    /// @notice Emite el pasaporte de una unidad fisica. Nunca recibe ni guarda el serial plano.
    function emitirProducto(
        bytes32 hashSerial,
        bytes32 hashMetadatos,
        string calldata lineaProducto
    ) external soloMarcaAutorizada returns (uint256 id) {
        if (hashSerial == bytes32(0)) revert HashSerialInvalido();
        if (hashMetadatos == bytes32(0)) revert HashMetadatosInvalido();
        if (bytes(lineaProducto).length == 0) revert LineaProductoInvalida();
        if (idPorHashSerial[hashSerial] != 0) revert SerialYaEmitido();

        id = ++ultimoId;
        productos[id] = Producto({
            emisor: msg.sender,
            hashSerial: hashSerial,
            hashMetadatos: hashMetadatos,
            lineaProducto: lineaProducto,
            duenoActual: msg.sender,
            estado: Estado.Activo,
            emitidoEn: block.timestamp
        });
        idPorHashSerial[hashSerial] = id;

        emit ProductoEmitido(id, msg.sender, hashSerial, hashMetadatos, lineaProducto);
    }

    /// @notice Revoca un pasaporte emitido por la misma marca emisora.
    function revocarProducto(uint256 id, bytes32 hashMotivo) external productoExiste(id) {
        Producto storage producto = productos[id];

        if (msg.sender != producto.emisor) revert SoloEmisor();
        if (producto.estado == Estado.Revocado) revert ProductoYaRevocado();
        if (hashMotivo == bytes32(0)) revert HashMotivoInvalido();

        producto.estado = Estado.Revocado;

        emit ProductoRevocado(id, msg.sender, hashMotivo);
    }

    /// @notice Transfiere el pasaporte de una unidad activa al nuevo dueno.
    function transferirProducto(uint256 id, address duenoNuevo) external productoExiste(id) {
        if (duenoNuevo == address(0)) revert DuenoInvalido();

        Producto storage producto = productos[id];
        address duenoAnterior = producto.duenoActual;

        if (msg.sender != duenoAnterior) revert SoloDuenoActual();
        if (producto.estado == Estado.Revocado) revert ProductoYaRevocado();
        if (duenoNuevo == duenoAnterior) revert DuenoInvalido();

        producto.duenoActual = duenoNuevo;

        emit ProductoTransferido(id, duenoAnterior, duenoNuevo);
    }

    /// @notice Devuelve el pasaporte asociado a un hash de serial.
    function verificarPorSerial(bytes32 hashSerial)
        external
        view
        returns (uint256 id, Producto memory producto)
    {
        id = idPorHashSerial[hashSerial];
        if (id == 0) revert ProductoNoExiste();

        producto = productos[id];
    }

    /// @notice Devuelve un pasaporte por id.
    function obtenerProducto(uint256 id)
        external
        view
        productoExiste(id)
        returns (Producto memory)
    {
        return productos[id];
    }
}

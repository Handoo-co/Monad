// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./RegistroEmpresas.sol";

/// @title PasaporteProductos
/// @notice Registra productos verificables por QR para empresas aprobadas en Handoo OriginPass V2.
contract PasaporteProductos {
    enum TipoProducto {
        ComercialOriginal,
        Artesanal
    }

    enum EstadoProducto {
        Activo,
        Revocado
    }

    struct Producto {
        uint256 id;
        address empresa;
        TipoProducto tipoProducto;
        EstadoProducto estado;
        bytes32 metadataHash;
        string metadataURI;
        bytes32 productHash;
        uint256 registradoEn;
        uint256 actualizadoEn;
    }

    error SoloAdministrador();
    error EmpresaNoAprobada();
    error TipoProductoInvalido();
    error MetadataInvalida();
    error ProductoNoExiste();
    error ProductoYaRevocado();
    error HashMotivoInvalido();
    error HashProductoInvalido();

    RegistroEmpresas public immutable registroEmpresas;
    address public immutable administrador;
    uint256 public totalProductos;

    mapping(uint256 idProducto => Producto producto) private productos;
    mapping(bytes32 productHash => uint256 idProducto) public idPorProductHash;
    mapping(address empresa => uint256[] idsProducto) private productosPorEmpresa;

    event ProductoRegistrado(
        uint256 indexed id,
        address indexed empresa,
        TipoProducto tipoProducto,
        bytes32 indexed productHash,
        bytes32 metadataHash,
        string metadataURI
    );
    event ProductoRevocado(uint256 indexed id, bytes32 hashMotivo);

    modifier soloAdministrador() {
        if (msg.sender != administrador) revert SoloAdministrador();
        _;
    }

    modifier productoExiste(uint256 idProducto) {
        if (idProducto == 0 || idProducto > totalProductos) revert ProductoNoExiste();
        _;
    }

    constructor(address registroEmpresas_) {
        if (registroEmpresas_ == address(0)) revert EmpresaNoAprobada();

        registroEmpresas = RegistroEmpresas(registroEmpresas_);
        administrador = msg.sender;
    }

    function registrarProducto(
        TipoProducto tipoProducto,
        bytes32 metadataHash,
        string calldata metadataURI
    ) external returns (uint256 idProducto, bytes32 productHash) {
        _validarEmpresaYProducto(msg.sender, tipoProducto);
        if (metadataHash == bytes32(0) || bytes(metadataURI).length == 0) revert MetadataInvalida();

        idProducto = ++totalProductos;
        productHash = keccak256(abi.encodePacked(block.chainid, address(this), idProducto));

        productos[idProducto] = Producto({
            id: idProducto,
            empresa: msg.sender,
            tipoProducto: tipoProducto,
            estado: EstadoProducto.Activo,
            metadataHash: metadataHash,
            metadataURI: metadataURI,
            productHash: productHash,
            registradoEn: block.timestamp,
            actualizadoEn: block.timestamp
        });

        idPorProductHash[productHash] = idProducto;
        productosPorEmpresa[msg.sender].push(idProducto);

        emit ProductoRegistrado(
            idProducto,
            msg.sender,
            tipoProducto,
            productHash,
            metadataHash,
            metadataURI
        );
    }

    function revocarProducto(uint256 idProducto, bytes32 hashMotivo)
        external
        soloAdministrador
        productoExiste(idProducto)
    {
        if (hashMotivo == bytes32(0)) revert HashMotivoInvalido();

        Producto storage producto = productos[idProducto];
        if (producto.estado == EstadoProducto.Revocado) revert ProductoYaRevocado();

        producto.estado = EstadoProducto.Revocado;
        producto.actualizadoEn = block.timestamp;

        emit ProductoRevocado(idProducto, hashMotivo);
    }

    function verificarProducto(uint256 idProducto, bytes32 productHash)
        external
        view
        productoExiste(idProducto)
        returns (Producto memory)
    {
        Producto memory producto = productos[idProducto];
        if (producto.productHash != productHash) revert HashProductoInvalido();

        return producto;
    }

    function obtenerProducto(uint256 idProducto)
        external
        view
        productoExiste(idProducto)
        returns (Producto memory)
    {
        return productos[idProducto];
    }

    function obtenerProductoPorHash(bytes32 productHash) external view returns (uint256 idProducto, Producto memory producto) {
        idProducto = idPorProductHash[productHash];
        if (idProducto == 0) revert ProductoNoExiste();

        producto = productos[idProducto];
    }

    function productoPorIndice(uint256 indice) external view returns (uint256 idProducto, Producto memory producto) {
        if (indice >= totalProductos) revert ProductoNoExiste();

        idProducto = indice + 1;
        producto = productos[idProducto];
    }

    function totalProductosEmpresa(address empresa) external view returns (uint256) {
        return productosPorEmpresa[empresa].length;
    }

    function productoEmpresaPorIndice(address empresa, uint256 indice)
        external
        view
        returns (uint256 idProducto, Producto memory producto)
    {
        if (indice >= productosPorEmpresa[empresa].length) revert ProductoNoExiste();

        idProducto = productosPorEmpresa[empresa][indice];
        producto = productos[idProducto];
    }

    function _validarEmpresaYProducto(address empresa, TipoProducto tipoProducto) private view {
        if (!registroEmpresas.empresaAprobada(empresa)) revert EmpresaNoAprobada();

        RegistroEmpresas.TipoEmpresa tipoEmpresa = registroEmpresas.tipoEmpresaDe(empresa);

        if (
            tipoEmpresa == RegistroEmpresas.TipoEmpresa.Comercial
                && tipoProducto != TipoProducto.ComercialOriginal
        ) {
            revert TipoProductoInvalido();
        }

        if (
            tipoEmpresa == RegistroEmpresas.TipoEmpresa.Artesanal
                && tipoProducto != TipoProducto.Artesanal
        ) {
            revert TipoProductoInvalido();
        }
    }
}

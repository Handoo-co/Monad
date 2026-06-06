// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title RegistroEmpresas
/// @notice Administra empresas comerciales verificadas y empresas artesanales aprobadas para Handoo OriginPass V2.
contract RegistroEmpresas {
    enum TipoEmpresa {
        Comercial,
        Artesanal
    }

    enum ModoVerificacion {
        CamaraComercio,
        RegistroOficial,
        RevisionArtesanalAdmin
    }

    enum EstadoEmpresa {
        Pendiente,
        Aprobada,
        Rechazada,
        Suspendida
    }

    struct Empresa {
        address cuenta;
        string nombre;
        TipoEmpresa tipoEmpresa;
        ModoVerificacion modoVerificacion;
        EstadoEmpresa estado;
        bytes32 metadataHash;
        string metadataURI;
        bytes32 hashVerificacion;
        uint256 solicitadaEn;
        uint256 actualizadaEn;
    }

    error SoloAdministrador();
    error EmpresaNoExiste();
    error EmpresaNoEditable();
    error NombreEmpresaInvalido();
    error MetadataInvalida();
    error ModoVerificacionInvalido();
    error HashVerificacionInvalido();
    error HashMotivoInvalido();

    address public immutable administrador;
    uint256 public totalEmpresas;

    mapping(uint256 idEmpresa => Empresa empresa) private empresas;
    mapping(address cuenta => uint256 idEmpresa) public idEmpresaPorCuenta;

    event EmpresaSolicitada(
        uint256 indexed idEmpresa,
        address indexed cuenta,
        TipoEmpresa tipoEmpresa,
        ModoVerificacion modoVerificacion,
        bytes32 metadataHash,
        string metadataURI
    );
    event EmpresaAprobada(uint256 indexed idEmpresa, address indexed cuenta);
    event EmpresaRechazada(uint256 indexed idEmpresa, bytes32 hashMotivo);
    event EmpresaSuspendida(uint256 indexed idEmpresa, bytes32 hashMotivo);
    event EmpresaReactivada(uint256 indexed idEmpresa);

    modifier soloAdministrador() {
        if (msg.sender != administrador) revert SoloAdministrador();
        _;
    }

    modifier empresaExiste(uint256 idEmpresa) {
        if (idEmpresa == 0 || idEmpresa > totalEmpresas) revert EmpresaNoExiste();
        _;
    }

    constructor() {
        administrador = msg.sender;
    }

    /// @notice Solicita o actualiza una solicitud pendiente/rechazada de registro.
    function solicitarRegistroEmpresa(
        string calldata nombre,
        TipoEmpresa tipoEmpresa,
        ModoVerificacion modoVerificacion,
        bytes32 metadataHash,
        string calldata metadataURI,
        bytes32 hashVerificacion
    ) external returns (uint256 idEmpresa) {
        _validarSolicitud(nombre, tipoEmpresa, modoVerificacion, metadataHash, metadataURI, hashVerificacion);

        idEmpresa = idEmpresaPorCuenta[msg.sender];

        if (idEmpresa == 0) {
            idEmpresa = ++totalEmpresas;
            idEmpresaPorCuenta[msg.sender] = idEmpresa;
            empresas[idEmpresa].cuenta = msg.sender;
            empresas[idEmpresa].solicitadaEn = block.timestamp;
        } else if (
            empresas[idEmpresa].estado == EstadoEmpresa.Aprobada
                || empresas[idEmpresa].estado == EstadoEmpresa.Suspendida
        ) {
            revert EmpresaNoEditable();
        }

        empresas[idEmpresa].nombre = nombre;
        empresas[idEmpresa].tipoEmpresa = tipoEmpresa;
        empresas[idEmpresa].modoVerificacion = modoVerificacion;
        empresas[idEmpresa].estado = EstadoEmpresa.Pendiente;
        empresas[idEmpresa].metadataHash = metadataHash;
        empresas[idEmpresa].metadataURI = metadataURI;
        empresas[idEmpresa].hashVerificacion = hashVerificacion;
        empresas[idEmpresa].actualizadaEn = block.timestamp;

        emit EmpresaSolicitada(
            idEmpresa,
            msg.sender,
            tipoEmpresa,
            modoVerificacion,
            metadataHash,
            metadataURI
        );
    }

    function aprobarEmpresa(uint256 idEmpresa)
        external
        soloAdministrador
        empresaExiste(idEmpresa)
    {
        Empresa storage empresa = empresas[idEmpresa];
        empresa.estado = EstadoEmpresa.Aprobada;
        empresa.actualizadaEn = block.timestamp;

        emit EmpresaAprobada(idEmpresa, empresa.cuenta);
    }

    function rechazarEmpresa(uint256 idEmpresa, bytes32 hashMotivo)
        external
        soloAdministrador
        empresaExiste(idEmpresa)
    {
        if (hashMotivo == bytes32(0)) revert HashMotivoInvalido();

        Empresa storage empresa = empresas[idEmpresa];
        empresa.estado = EstadoEmpresa.Rechazada;
        empresa.actualizadaEn = block.timestamp;

        emit EmpresaRechazada(idEmpresa, hashMotivo);
    }

    function suspenderEmpresa(uint256 idEmpresa, bytes32 hashMotivo)
        external
        soloAdministrador
        empresaExiste(idEmpresa)
    {
        if (hashMotivo == bytes32(0)) revert HashMotivoInvalido();

        Empresa storage empresa = empresas[idEmpresa];
        empresa.estado = EstadoEmpresa.Suspendida;
        empresa.actualizadaEn = block.timestamp;

        emit EmpresaSuspendida(idEmpresa, hashMotivo);
    }

    function reactivarEmpresa(uint256 idEmpresa)
        external
        soloAdministrador
        empresaExiste(idEmpresa)
    {
        Empresa storage empresa = empresas[idEmpresa];
        empresa.estado = EstadoEmpresa.Aprobada;
        empresa.actualizadaEn = block.timestamp;

        emit EmpresaReactivada(idEmpresa);
    }

    function obtenerEmpresa(uint256 idEmpresa)
        external
        view
        empresaExiste(idEmpresa)
        returns (Empresa memory)
    {
        return empresas[idEmpresa];
    }

    function obtenerEmpresaPorCuenta(address cuenta) external view returns (uint256 idEmpresa, Empresa memory empresa) {
        idEmpresa = idEmpresaPorCuenta[cuenta];
        if (idEmpresa == 0) revert EmpresaNoExiste();

        empresa = empresas[idEmpresa];
    }

    function empresaPorIndice(uint256 indice) external view returns (uint256 idEmpresa, Empresa memory empresa) {
        if (indice >= totalEmpresas) revert EmpresaNoExiste();

        idEmpresa = indice + 1;
        empresa = empresas[idEmpresa];
    }

    function empresaAprobada(address cuenta) external view returns (bool) {
        uint256 idEmpresa = idEmpresaPorCuenta[cuenta];
        return idEmpresa != 0 && empresas[idEmpresa].estado == EstadoEmpresa.Aprobada;
    }

    function tipoEmpresaDe(address cuenta) external view returns (TipoEmpresa) {
        uint256 idEmpresa = idEmpresaPorCuenta[cuenta];
        if (idEmpresa == 0) revert EmpresaNoExiste();

        return empresas[idEmpresa].tipoEmpresa;
    }

    function _validarSolicitud(
        string calldata nombre,
        TipoEmpresa tipoEmpresa,
        ModoVerificacion modoVerificacion,
        bytes32 metadataHash,
        string calldata metadataURI,
        bytes32 hashVerificacion
    ) private pure {
        if (bytes(nombre).length == 0) revert NombreEmpresaInvalido();
        if (metadataHash == bytes32(0) || bytes(metadataURI).length == 0) revert MetadataInvalida();

        if (tipoEmpresa == TipoEmpresa.Comercial) {
            if (modoVerificacion == ModoVerificacion.RevisionArtesanalAdmin) {
                revert ModoVerificacionInvalido();
            }
            if (hashVerificacion == bytes32(0)) revert HashVerificacionInvalido();
        } else {
            if (modoVerificacion != ModoVerificacion.RevisionArtesanalAdmin) {
                revert ModoVerificacionInvalido();
            }
        }
    }
}

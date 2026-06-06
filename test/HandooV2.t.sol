// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../contracts/RegistroEmpresas.sol";
import "../contracts/PasaporteProductos.sol";

interface VmV2 {
    function prank(address msgSender) external;
    function expectRevert(bytes4 selector) external;
    function chainId(uint256 newChainId) external;
}

contract HandooV2Test {
    VmV2 private constant vm = VmV2(address(uint160(uint256(keccak256("hevm cheat code")))));

    RegistroEmpresas private registro;
    PasaporteProductos private pasaportes;

    address private constant COMERCIAL = address(0x1001);
    address private constant ARTESANO = address(0x2002);
    address private constant EXTERNO = address(0x3003);

    bytes32 private constant HASH_METADATA_EMPRESA =
        0x1111111111111111111111111111111111111111111111111111111111111111;
    bytes32 private constant HASH_METADATA_ARTESANO =
        0x2222222222222222222222222222222222222222222222222222222222222222;
    bytes32 private constant HASH_VERIFICACION =
        0x3333333333333333333333333333333333333333333333333333333333333333;
    bytes32 private constant HASH_PRODUCTO_METADATA =
        0x4444444444444444444444444444444444444444444444444444444444444444;
    bytes32 private constant HASH_MOTIVO =
        0x5555555555555555555555555555555555555555555555555555555555555555;

    function setUp() public {
        vm.chainId(10143);
        registro = new RegistroEmpresas();
        pasaportes = new PasaporteProductos(address(registro));
    }

    function testApruebaEmpresaComercialConVerificacion() public {
        uint256 idEmpresa = solicitarComercial();

        registro.aprobarEmpresa(idEmpresa);

        RegistroEmpresas.Empresa memory empresa = registro.obtenerEmpresa(idEmpresa);
        require(empresa.cuenta == COMERCIAL, "cuenta");
        require(empresa.tipoEmpresa == RegistroEmpresas.TipoEmpresa.Comercial, "tipo");
        require(empresa.modoVerificacion == RegistroEmpresas.ModoVerificacion.CamaraComercio, "modo");
        require(empresa.estado == RegistroEmpresas.EstadoEmpresa.Aprobada, "estado");
        require(registro.empresaAprobada(COMERCIAL), "aprobada");
    }

    function testRechazaComercialSinHashVerificacion() public {
        vm.prank(COMERCIAL);
        vm.expectRevert(RegistroEmpresas.HashVerificacionInvalido.selector);
        registro.solicitarRegistroEmpresa(
            "Tienda comercial",
            RegistroEmpresas.TipoEmpresa.Comercial,
            RegistroEmpresas.ModoVerificacion.CamaraComercio,
            HASH_METADATA_EMPRESA,
            "/demo-metadata/company-commercial.json",
            bytes32(0)
        );
    }

    function testApruebaArtesanoSinCamaraComercio() public {
        uint256 idEmpresa = solicitarArtesano();

        registro.aprobarEmpresa(idEmpresa);

        RegistroEmpresas.Empresa memory empresa = registro.obtenerEmpresa(idEmpresa);
        require(empresa.cuenta == ARTESANO, "cuenta");
        require(empresa.tipoEmpresa == RegistroEmpresas.TipoEmpresa.Artesanal, "tipo");
        require(
            empresa.modoVerificacion == RegistroEmpresas.ModoVerificacion.RevisionArtesanalAdmin,
            "modo"
        );
        require(empresa.hashVerificacion == bytes32(0), "hash opcional");
        require(empresa.estado == RegistroEmpresas.EstadoEmpresa.Aprobada, "estado");
    }

    function testSoloAdminApruebaYSuspende() public {
        uint256 idEmpresa = solicitarComercial();

        vm.prank(EXTERNO);
        vm.expectRevert(RegistroEmpresas.SoloAdministrador.selector);
        registro.aprobarEmpresa(idEmpresa);

        registro.aprobarEmpresa(idEmpresa);

        vm.prank(EXTERNO);
        vm.expectRevert(RegistroEmpresas.SoloAdministrador.selector);
        registro.suspenderEmpresa(idEmpresa, HASH_MOTIVO);

        registro.suspenderEmpresa(idEmpresa, HASH_MOTIVO);
        RegistroEmpresas.Empresa memory empresa = registro.obtenerEmpresa(idEmpresa);
        require(empresa.estado == RegistroEmpresas.EstadoEmpresa.Suspendida, "suspendida");
    }

    function testEmpresaSuspendidaNoPuedeResetearSolicitud() public {
        uint256 idEmpresa = solicitarComercial();
        registro.aprobarEmpresa(idEmpresa);
        registro.suspenderEmpresa(idEmpresa, HASH_MOTIVO);

        vm.prank(COMERCIAL);
        vm.expectRevert(RegistroEmpresas.EmpresaNoEditable.selector);
        registro.solicitarRegistroEmpresa(
            "Tienda comercial editada",
            RegistroEmpresas.TipoEmpresa.Comercial,
            RegistroEmpresas.ModoVerificacion.CamaraComercio,
            HASH_METADATA_EMPRESA,
            "/demo-metadata/company-commercial.json",
            HASH_VERIFICACION
        );
    }

    function testEmpresaNoAprobadaNoRegistraProducto() public {
        solicitarComercial();

        vm.prank(COMERCIAL);
        vm.expectRevert(PasaporteProductos.EmpresaNoAprobada.selector);
        pasaportes.registrarProducto(
            PasaporteProductos.TipoProducto.ComercialOriginal,
            HASH_PRODUCTO_METADATA,
            "/demo-metadata/product-commercial.json"
        );
    }

    function testRegistraProductoComercialConHashQr() public {
        aprobarComercial();

        vm.prank(COMERCIAL);
        (uint256 idProducto, bytes32 productHash) = pasaportes.registrarProducto(
            PasaporteProductos.TipoProducto.ComercialOriginal,
            HASH_PRODUCTO_METADATA,
            "/demo-metadata/product-commercial.json"
        );

        bytes32 esperado = keccak256(abi.encodePacked(uint256(10143), address(pasaportes), idProducto));
        require(productHash == esperado, "hash qr");

        PasaporteProductos.Producto memory producto = pasaportes.verificarProducto(idProducto, productHash);
        require(producto.empresa == COMERCIAL, "empresa");
        require(producto.tipoProducto == PasaporteProductos.TipoProducto.ComercialOriginal, "tipo");
        require(producto.estado == PasaporteProductos.EstadoProducto.Activo, "estado");
    }

    function testArtesanoSoloRegistraProductoArtesanal() public {
        aprobarArtesano();

        vm.prank(ARTESANO);
        vm.expectRevert(PasaporteProductos.TipoProductoInvalido.selector);
        pasaportes.registrarProducto(
            PasaporteProductos.TipoProducto.ComercialOriginal,
            HASH_PRODUCTO_METADATA,
            "/demo-metadata/product-artisan.json"
        );

        vm.prank(ARTESANO);
        (uint256 idProducto,) = pasaportes.registrarProducto(
            PasaporteProductos.TipoProducto.Artesanal,
            HASH_PRODUCTO_METADATA,
            "/demo-metadata/product-artisan.json"
        );

        PasaporteProductos.Producto memory producto = pasaportes.obtenerProducto(idProducto);
        require(producto.tipoProducto == PasaporteProductos.TipoProducto.Artesanal, "artesanal");
    }

    function testAdminRevocaProducto() public {
        aprobarComercial();

        vm.prank(COMERCIAL);
        (uint256 idProducto,) = pasaportes.registrarProducto(
            PasaporteProductos.TipoProducto.ComercialOriginal,
            HASH_PRODUCTO_METADATA,
            "/demo-metadata/product-commercial.json"
        );

        vm.prank(EXTERNO);
        vm.expectRevert(PasaporteProductos.SoloAdministrador.selector);
        pasaportes.revocarProducto(idProducto, HASH_MOTIVO);

        pasaportes.revocarProducto(idProducto, HASH_MOTIVO);

        PasaporteProductos.Producto memory producto = pasaportes.obtenerProducto(idProducto);
        require(producto.estado == PasaporteProductos.EstadoProducto.Revocado, "revocado");
    }

    function solicitarComercial() private returns (uint256 idEmpresa) {
        vm.prank(COMERCIAL);
        idEmpresa = registro.solicitarRegistroEmpresa(
            "Tienda comercial",
            RegistroEmpresas.TipoEmpresa.Comercial,
            RegistroEmpresas.ModoVerificacion.CamaraComercio,
            HASH_METADATA_EMPRESA,
            "/demo-metadata/company-commercial.json",
            HASH_VERIFICACION
        );
    }

    function solicitarArtesano() private returns (uint256 idEmpresa) {
        vm.prank(ARTESANO);
        idEmpresa = registro.solicitarRegistroEmpresa(
            "Taller artesanal",
            RegistroEmpresas.TipoEmpresa.Artesanal,
            RegistroEmpresas.ModoVerificacion.RevisionArtesanalAdmin,
            HASH_METADATA_ARTESANO,
            "/demo-metadata/company-artisan.json",
            bytes32(0)
        );
    }

    function aprobarComercial() private {
        uint256 idEmpresa = solicitarComercial();
        registro.aprobarEmpresa(idEmpresa);
    }

    function aprobarArtesano() private {
        uint256 idEmpresa = solicitarArtesano();
        registro.aprobarEmpresa(idEmpresa);
    }
}

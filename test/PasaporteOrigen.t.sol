// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../contracts/PasaporteOrigen.sol";

interface Vm {
    function prank(address msgSender) external;
    function expectRevert(bytes4 selector) external;
}

contract PasaporteOrigenTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    PasaporteOrigen private pasaporte;

    address private constant MARCA = address(0x1001);
    address private constant COMPRADOR = address(0x2002);
    address private constant SEGUNDO_COMPRADOR = address(0x3003);

    bytes32 private constant HASH_MARCA =
        0x2f8f9f3a8a9c6e6e7c0d5a4a9c8b7e6f5d4c3b2a19080706050403020100ff00;
    bytes32 private constant HASH_SERIAL =
        0x1d4d8b1b7f6a4c3e2d1c0b9a887766554433221100ffeeddccbbaa9988776655;
    bytes32 private constant HASH_METADATOS =
        0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899;
    bytes32 private constant HASH_MOTIVO =
        0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef;

    function setUp() public {
        pasaporte = new PasaporteOrigen();
    }

    function testEmiteProductoConMarcaAutorizada() public {
        uint256 id = emitirDemo();
        PasaporteOrigen.Producto memory producto = pasaporte.obtenerProducto(id);

        require(id == 1, "id");
        require(producto.emisor == MARCA, "emisor");
        require(producto.hashSerial == HASH_SERIAL, "hash serial");
        require(producto.hashMetadatos == HASH_METADATOS, "hash metadata");
        require(producto.duenoActual == MARCA, "dueno");
        require(producto.estado == PasaporteOrigen.Estado.Activo, "estado");
    }

    function testRechazaMarcaNoAutorizada() public {
        vm.prank(MARCA);
        vm.expectRevert(PasaporteOrigen.MarcaNoAutorizada.selector);
        pasaporte.emitirProducto(HASH_SERIAL, HASH_METADATOS, "Sombrero vueltiao demo");
    }

    function testRechazaSerialDuplicado() public {
        emitirDemo();

        vm.prank(MARCA);
        vm.expectRevert(PasaporteOrigen.SerialYaEmitido.selector);
        pasaporte.emitirProducto(HASH_SERIAL, HASH_METADATOS, "Sombrero vueltiao demo");
    }

    function testRevocaSoloEmisor() public {
        uint256 id = emitirDemo();

        vm.prank(COMPRADOR);
        vm.expectRevert(PasaporteOrigen.SoloEmisor.selector);
        pasaporte.revocarProducto(id, HASH_MOTIVO);

        vm.prank(MARCA);
        pasaporte.revocarProducto(id, HASH_MOTIVO);

        PasaporteOrigen.Producto memory producto = pasaporte.obtenerProducto(id);
        require(producto.estado == PasaporteOrigen.Estado.Revocado, "revocado");
    }

    function testTransfiereProductoSoloDuenoActual() public {
        uint256 id = emitirDemo();

        vm.prank(COMPRADOR);
        vm.expectRevert(PasaporteOrigen.SoloDuenoActual.selector);
        pasaporte.transferirProducto(id, SEGUNDO_COMPRADOR);

        vm.prank(MARCA);
        vm.expectRevert(PasaporteOrigen.DuenoInvalido.selector);
        pasaporte.transferirProducto(id, address(0));

        vm.prank(MARCA);
        pasaporte.transferirProducto(id, COMPRADOR);

        PasaporteOrigen.Producto memory producto = pasaporte.obtenerProducto(id);
        require(producto.duenoActual == COMPRADOR, "primer transfer");

        vm.prank(MARCA);
        vm.expectRevert(PasaporteOrigen.SoloDuenoActual.selector);
        pasaporte.transferirProducto(id, SEGUNDO_COMPRADOR);

        vm.prank(COMPRADOR);
        pasaporte.transferirProducto(id, SEGUNDO_COMPRADOR);

        producto = pasaporte.obtenerProducto(id);
        require(producto.duenoActual == SEGUNDO_COMPRADOR, "segundo transfer");
    }

    function testNoTransfiereProductoRevocado() public {
        uint256 id = emitirDemo();

        vm.prank(MARCA);
        pasaporte.revocarProducto(id, HASH_MOTIVO);

        vm.prank(MARCA);
        vm.expectRevert(PasaporteOrigen.ProductoYaRevocado.selector);
        pasaporte.transferirProducto(id, COMPRADOR);
    }

    function autorizarMarca() private {
        pasaporte.registrarMarca(MARCA, "Handoo Demo Brand", HASH_MARCA, true);
    }

    function emitirDemo() private returns (uint256 id) {
        autorizarMarca();

        vm.prank(MARCA);
        id = pasaporte.emitirProducto(
            HASH_SERIAL,
            HASH_METADATOS,
            "Sombrero vueltiao demo"
        );
    }
}

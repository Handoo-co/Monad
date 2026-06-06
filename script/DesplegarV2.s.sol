// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {RegistroEmpresas} from "../contracts/RegistroEmpresas.sol";
import {PasaporteProductos} from "../contracts/PasaporteProductos.sol";

/// @title DesplegarV2
/// @notice Despliega el stack V2 (RegistroEmpresas + PasaporteProductos) en Monad Testnet.
/// @dev Uso (ver scripts/deploy-v2.sh y package.json):
///   forge script script/DesplegarV2.s.sol:DesplegarV2 \
///     --rpc-url monad_testnet \
///     --broadcast
///   con la variable de entorno DEPLOYER_PK seteada (clave hex con prefijo 0x).
contract DesplegarV2 is Script {
    function run() external returns (RegistroEmpresas registro, PasaporteProductos pasaporte) {
        uint256 deployerKey = vm.envUint("DEPLOYER_PK");
        address deployer = vm.addr(deployerKey);

        console2.log("==========================================");
        console2.log("Handoo OriginPass V2 - Deploy en Monad Testnet");
        console2.log("==========================================");
        console2.log("Deployer (admin):", deployer);
        console2.log("Chain ID:        ", block.chainid);
        console2.log("");

        vm.startBroadcast(deployerKey);

        // 1. RegistroEmpresas (sin args, admin = msg.sender)
        registro = new RegistroEmpresas();
        console2.log("RegistroEmpresas desplegado en:", address(registro));

        // 2. PasaporteProductos (recibe address de RegistroEmpresas)
        pasaporte = new PasaporteProductos(address(registro));
        console2.log("PasaporteProductos desplegado en:", address(pasaporte));

        vm.stopBroadcast();

        console2.log("");
        console2.log("==========================================");
        console2.log("Variables Vercel/local a configurar:");
        console2.log("==========================================");
        console2.log("VITE_REGISTRO_EMPRESAS_ADDRESS=", address(registro));
        console2.log("VITE_PASAPORTE_PRODUCTOS_ADDRESS=", address(pasaporte));
        console2.log("");
        console2.log("Verificar en explorer:");
        console2.log("https://monad-testnet.socialscan.io/address/%s", address(registro));
        console2.log("https://monad-testnet.socialscan.io/address/%s", address(pasaporte));
    }
}

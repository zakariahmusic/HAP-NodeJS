const hap = require("./dist");

const Accessory = hap.Accessory;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;
const Service = hap.Service;

// optionally set a different storage location with code below
// hap.HAPStorage.setCustomStoragePath("...");

const accessoryUuid = hap.uuid.generate("hap.examples.lock-nfc");
const accessory = new Accessory("NFC Lock", accessoryUuid);

accessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.HardwareFinish, "AQT///8A");

const lockManagementService = new Service.LockManagement("Lock Management");
const lockMechanismService = new Service.LockMechanism("NFC Lock");
const nfcAccessService = new Service.NFCAccessService("NFC Access");

nfcAccessService.setCharacteristic(Characteristic.NFCAccessSupportedConfiguration, "AQEQAgEQ");

const configState = nfcAccessService.getCharacteristic(Characteristic.ConfigurationState);
const controlPoint = nfcAccessService.getCharacteristic(Characteristic.NFCAccessControlPoint);

configState.on(CharacteristicEventTypes.GET, callback => {
    console.log("Queried config state: ");
    callback(undefined, 0);
});

controlPoint.on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log("Control Point Write: " + value);
    callback(undefined, "");
});

let lockState = Characteristic.LockCurrentState.UNSECURED;

const currentStateCharacteristic = lockMechanismService.getCharacteristic(Characteristic.LockCurrentState);
const targetStateCharacteristic = lockMechanismService.getCharacteristic(Characteristic.LockTargetState);

currentStateCharacteristic.on(CharacteristicEventTypes.GET, callback => {
  console.log("Queried current lock state: " + lockState);
  callback(undefined, lockState);
});

targetStateCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
  console.log("Setting lock state to: " + value);
  lockState = value;
  callback();
  setTimeout(() => {
      currentStateCharacteristic.updateValue(lockState);
  }, 1000);
});

accessory.addService(lockManagementService);
accessory.addService(lockMechanismService);
accessory.addService(nfcAccessService);

// once everything is set up, we publish the accessory. Publish should always be the last step!
accessory.publish({
  username: "17:51:07:F4:BC:3C",
  pincode: "678-90-876",
  port: 47169,
  category: hap.Categories.DOOR_LOCK, // value here defines the symbol shown in the pairing screen
});

console.log("Accessory setup finished!");
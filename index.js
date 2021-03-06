// Dependency modules
var events        = require('events');

// Local modules
var baClient      = require('./lib/bacnet-client');
var baEnum        = require('./lib/bacnet-enum');

/**
 * To be able to communicate to BACNET devices, you have to initialize a new bacstack instance.
 * @class bacstack
 * @param {object=} settings - The options object used for parameterising the bacstack.
 * @param {number=} [settings.port=47808] - BACNET communication port for listening and sending.
 * @param {string=} settings.interface - Specific BACNET communication interface if different from primary one.
 * @param {string=} [settings.broadcastAddress=255.255.255.255] - The address used for broadcast messages.
 * @param {number=} [settings.adpuTimeout=3000] - The timeout in milliseconds until a transaction should be interpreted as error.
 * @example
 * var bacnet = require('bacstack');
 *
 * var client = bacnet({
 *   port: 47809,                          // Use BAC1 as communication port
 *   interface: '192.168.251.10',          // Listen on a specific interface
 *   broadcastAddress: '192.168.251.255',  // Use the subnet broadcast address
 *   adpuTimeout: 6000                     // Wait twice as long for response
 * });
 */
module.exports = function(settings) {
  var self = new events.EventEmitter();

  settings = settings || {};
  var options = {
    port: settings.port || 47808,
    interface: settings.interface,
    transport: settings.transport,
    broadcastAddress: settings.broadcastAddress || '255.255.255.255',
    adpuTimeout: settings.adpuTimeout || 3000
  };

  var client = baClient(options);

  // Public enums
  self.enum = baEnum;

  /**
   * The whoIs command discovers all BACNET devices in a network.
   * @function bacstack.whoIs
   * @param {number=} lowLimit - Minimal device instance number to search for.
   * @param {number=} highLimit - Maximal device instance number to search for.
   * @param {string=} address - Unicast address if command should device directly.
   * @fires bacstack.iAm
   * @example
   * client.whoIs();
   */
  self.whoIs = function(lowLimit, highLimit, address) {
    client.whoIs(lowLimit, highLimit, address, function(address, deviceId, maxAdpu, segmentation, vendorId) {

      /**
       * @event bacstack.iAm
       * @param {string} address - The IP address of the detected device.
       * @param {number} deviceId - The BACNET device-id of the detected device.
       * @param {number} maxAdpu - The max ADPU size the detected device is supporting.
       * @param {number} segmentation - The type of segmentation the detected device is supporting.
       * @param {number} vendorId - The BACNET vendor-id of the detected device.
       * @example
       * client.on('iAm', function(address, deviceId, maxAdpu, segmentation, vendorId) {
       *   console.log('address: ', address, ' - deviceId: ', deviceId, ' - maxAdpu: ', maxAdpu, ' - segmentation: ', segmentation, ' - vendorId: ', vendorId);
       * });
       */
      self.emit('iAm', address, deviceId, maxAdpu, segmentation, vendorId);
    });
  };

  /**
   * The readProperty command reads a single property of an object from a device.
   * @function bacstack.readProperty
   * @param {string} address - IP address of the target device.
   * @param {number} objectType - The BACNET object type to read.
   * @param {number} objectInstance - The BACNET object instance to read.
   * @param {number} propertyId - The BACNET property id in the specified object to read.
   * @param {number=} arrayIndex - The array index of the property to be read.
   * @param {function} next - The callback containing an error, in case of a failure and value object in case of success.
   * @example
   * client.readProperty('192.168.1.43', 8, 44301, 28, null, function(err, value) {
   *   console.log('value: ', value);
   * });
   */
  self.readProperty = function(address, objectType, objectInstance, propertyId, arrayIndex, next) {
    client.readProperty(address, objectType, objectInstance, propertyId, arrayIndex, next);
  };

  /**
   * The writeProperty command writes a single property of an object to a device.
   * @function bacstack.writeProperty
   * @param {string} address - IP address of the target device.
   * @param {number} objectType - The BACNET object type to write.
   * @param {number} objectInstance - The BACNET object instance to write.
   * @param {number} propertyId - The BACNET property id in the specified object to write.
   * @param {number} priority - The priority to be used for writing to the property.
   * @param {object[]} valueList - A list of values to be written to the speicifed property.
   * @param {number} valueList.Tag - The data-type of the value to be written. Has to be a BacnetApplicationTags declaration as specified in lib/bacnet-enum.js.
   * @param {number} valueList.Value - The actual value to be written.
   * @param {function} next - The callback containing an error, in case of a failure and value object in case of success.
   * @example
   * client.writeProperty('192.168.1.43', 8, 44301, 28, 12, [{Tag: 4, Value: 100}], function(err, value) {
   *   console.log('value: ', value);
   * });
   */
  self.writeProperty = function(address, objectType, objectInstance, propertyId, priority, valueList, next) {
    client.writeProperty(address, objectType, objectInstance, propertyId, priority, valueList, next);
  };

  /**
   * The readPropertyMultiple command reads multiple properties in multiple objects from a device.
   * @function bacstack.readPropertyMultiple
   * @param {string} address - IP address of the target device.
   * @param {object[]} propertyIdAndArrayIndex - List of object and property specifications to be read.
   * @param {object} propertyIdAndArrayIndex.objectIdentifier - Specifies which object to read.
   * @param {number} propertyIdAndArrayIndex.objectIdentifier.type - The BACNET object type to read.
   * @param {number} propertyIdAndArrayIndex.objectIdentifier.instance - The BACNET object instance to read.
   * @param {object[]} propertyIdAndArrayIndex.propertyReferences - List of properties to be read.
   * @param {number} propertyIdAndArrayIndex.propertyReferences.propertyIdentifier - The BACNET property id in the specified object to read. Also supports 8 for all properties.
   * @param {function} next - The callback containing an error, in case of a failure and value object in case of success.
   * @example
   * var requestArray = [
   *   {objectIdentifier: {type: 8, instance: 4194303}, propertyReferences: [{propertyIdentifier: 8}]}
   * ];
   * client.readPropertyMultiple('192.168.1.43', requestArray, function(err, value) {
   *   console.log('value: ', value);
   * });
   */
  self.readPropertyMultiple = function(address, propertyIdAndArrayIndex, next) {
    client.readPropertyMultiple(address, propertyIdAndArrayIndex, next);
  };

  return self;
};

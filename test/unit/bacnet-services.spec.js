var expect        = require('chai').expect;
var utils         = require('./utils');
var baServices    = require('../../lib/bacnet-services');

describe('bacstack - Services layer', function() {
  describe('Iam', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeIamBroadcast(buffer, 47, 1, 1, 7);
      var result = baServices.decodeIamBroadcast(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        deviceId: 47,
        maxApdu: 1,
        segmentation: 1,
        vendorId: 7
      });
    });
  });

  describe('WhoHas', function() {
    it('should successfully encode and decode by id', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeWhoHasBroadcast(buffer, 3, 4000, {type: 3, instance: 15});
      var result = baServices.DecodeWhoHasBroadcast(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        lowLimit: 3,
        highLimit: 4000,
        objId: {
          type: 3,
          instance: 15
        }
      });
    });

    it('should successfully encode and decode by name', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeWhoHasBroadcast(buffer, 3, 4000, {}, 'analog-output-1');
      var result = baServices.DecodeWhoHasBroadcast(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        lowLimit: 3,
        highLimit: 4000,
        objName: 'analog-output-1'
      });
    });
  });

  describe('WhoIs', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeWhoIsBroadcast(buffer, 1, 3000);
      var result = baServices.DecodeWhoIsBroadcast(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        lowLimit: 1,
        highLimit: 3000
      });
    });
  });

  describe('ReadPropertyAcknowledge', function() {
    it('should successfully encode and decode a boolean value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 1, Value: true},
        {Tag: 1, Value: false}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 1, value: true, len: 1},
          {type: 1, value: false, len: 1}
        ]
      });
    });

    it('should successfully encode and decode an unsigned value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 2, Value: 1},
        {Tag: 2, Value: 1000},
        {Tag: 2, Value: 1000000},
        {Tag: 2, Value: 1000000000}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 2, value: 1, len: 2},
          {type: 2, value: 1000, len: 3},
          {type: 2, value: 1000000, len: 4},
          {type: 2, value: 1000000000, len: 5}
        ]
      });
    });

    it('should successfully encode and decode a signed value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 3, Value: -1},
        {Tag: 3, Value: -1000},
        {Tag: 3, Value: -1000000},
        {Tag: 3, Value: -1000000000}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 3, value: -1, len: 2},
          {type: 3, value: -1000, len: 3},
          {type: 3, value: -1000000, len: 4},
          {type: 3, value: -1000000000, len: 5}
        ]
      });
    });

    it('should successfully encode and decode an real value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 4, Value: 0},
        {Tag: 4, Value: 0.1}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(Math.floor(0.1 * 10000)).to.equal(Math.floor(result.valueList[1].value * 10000));
      result.valueList[1].value = 0;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 4, value: 0, len: 5},
          {type: 4, value: 0, len: 5}
        ]
      });
    });

    it('should successfully encode and decode a double value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 5, Value: 0},
        {Tag: 5, Value: 100.121212}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 5, value: 0, len: 10},
          {type: 5, value: 100.121212, len: 10}
        ]
      });
    });

    it('should successfully encode and decode an octet-string value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 6, Value: []},
        {Tag: 6, Value: [1, 2, 100, 200]}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 6, value: [], len: 1},
          {type: 6, value: [1, 2, 100, 200], len: 5}
        ]
      });
    });

    it('should successfully encode and decode a character-string value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 7, Value: ''},
        {Tag: 7, Value: 'Test1234$'}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 7, value: '', len: 2},
          {type: 7, value: 'Test1234$', len: 12}
        ]
      });
    });

    it('should successfully encode and decode a bit-string value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 8, Value: {bits_used: 0, value: []}},
        {Tag: 8, Value: {bits_used: 24, value: [0xAA, 0xAA, 0xAA]}}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 8, value: {bits_used: 0, value: []}, len: 2},
          {type: 8, value: {bits_used: 24, value: [0xAA, 0xAA, 0xAA]}, len: 5}
        ]
      });
    });

    it('should successfully encode and decode a enumeration value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 9, Value: 0},
        {Tag: 9, Value: 4}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 9, value: 0, len: 2},
          {type: 9, value: 4, len: 2}
        ]
      });
    });

    it('should successfully encode and decode a date value', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 10, Value: date}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 10, value: date, len: 5}
        ]
      });
    });

    it('should successfully encode and decode a time value', function() {
      var buffer = utils.getBuffer();
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 11, Value: time}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 11, value: time, len: 5}
        ]
      });
    });

    it('should successfully encode and decode a object-identifier value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {Tag: 12, Value: {type: 3, instance: 0}},
        {Tag: 12, Value: {type: 3, instance: 50000}},
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 12, value: {type: 3, instance: 0}, len: 5},
          {type: 12, value: {type: 3, instance: 50000}, len: 5}
        ]
      });
    });

    it('should successfully encode and decode a cov-subscription value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 222, instance: 3}, 152, 0xFFFFFFFF, [
        {Tag: 111, Value: {
          Recipient: {net: 12, adr: [0, 1]},
          subscriptionProcessIdentifier: 3,
          monitoredObjectIdentifier: {type: 2, instance: 1},
          monitoredProperty: {propertyIdentifier: 85, propertyArrayIndex: 0},
          IssueConfirmedNotifications: false,
          TimeRemaining: 5,
          COVIncrement: 1
        }},
        {Tag: 111, Value: {
          Recipient: {net: 0xFFFF, adr: []},
          subscriptionProcessIdentifier: 3,
          monitoredObjectIdentifier: {type: 2, instance: 1},
          monitoredProperty: {propertyIdentifier: 85, propertyArrayIndex: 5},
          IssueConfirmedNotifications: true,
          TimeRemaining: 5
        }}
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 222,
          instance: 3
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 152
        },
        valueList: [
          {type: 111, value: {
            recipient: {net: 12, adr: [0, 1]},
            subscriptionProcessIdentifier: 3,
            monitoredObjectIdentifier: {type: 2, instance: 1},
            monitoredProperty: {propertyIdentifier: 85, propertyArrayIndex: 0},
            issueConfirmedNotifications: false,
            timeRemaining: 5,
            covIncrement: 1
          }, len: 33},
          {type: 111, value: {
            recipient: {net: 0xFFFF, adr: []},
            subscriptionProcessIdentifier: 3,
            monitoredObjectIdentifier: {type: 2, instance: 1},
            monitoredProperty: {propertyIdentifier: 85, propertyArrayIndex: 5},
            issueConfirmedNotifications: true,
            timeRemaining: 5,
          }, len: 27}
        ]
      });
    });

    it('should successfully encode and decode a read-access-specification value', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReadPropertyAcknowledge(buffer, {type: 223, instance: 90000}, 53, 0xFFFFFFFF, [
        {Tag: 115, Value: {objectIdentifier: {type: 3, instance: 0}, propertyReferences: []}},
        {Tag: 115, Value: {objectIdentifier: {type: 3, instance: 50000}, propertyReferences: [
          {propertyIdentifier: 85},
          {propertyIdentifier: 1, propertyArrayIndex: 2}
        ]}},
      ]);
      var result = baServices.DecodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 223,
          instance: 90000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 53
        },
        valueList: [
          {type: 115, value: {objectIdentifier: {type: 3, instance: 0}, propertyReferences: []}, len: 7},
          {type: 115, value: {objectIdentifier: {type: 3, instance: 50000}, propertyReferences: [
            {propertyIdentifier: 85, propertyArrayIndex: 0xFFFFFFFF},
            {propertyIdentifier: 1, propertyArrayIndex: 2}
          ]}, len: 13}
        ]
      });
    });
  });

  describe('ReadPropertyMultipleAcknowledge', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.EncodeReadPropertyMultipleAcknowledge(buffer, [
        {objectIdentifier: {type: 9, instance: 50000}, values: [
          {property: {propertyIdentifier: 81, propertyArrayIndex: 0xFFFFFFFF}, value: [
            {Tag: 1, Value: true},
            {Tag: 1, Value: false},
            {Tag: 2, Value: 1},
            {Tag: 2, Value: 1000},
            {Tag: 2, Value: 1000000},
            {Tag: 2, Value: 1000000000},
            {Tag: 3, Value: -1},
            {Tag: 3, Value: -1000},
            {Tag: 3, Value: -1000000},
            {Tag: 3, Value: -1000000000},
            {Tag: 4, Value: 0.1},
            {Tag: 5, Value: 100.121212},
            // FIXME: correct octet-string implementation
            // {Tag: 6, Value: [1, 2, 100, 200]},
            {Tag: 7, Value: 'Test1234$'},
            // FIXME: correct bit-string implementation
            // {Tag: 8, Value: {bits_used: 0, value: []}},
            // {Tag: 8, Value: {bits_used: 24, value: [0xAA, 0xAA, 0xAA]}},
            {Tag: 9, Value: 4},
            {Tag: 10, Value: date},
            {Tag: 11, Value: time},
            {Tag: 12, Value: {type: 3, instance: 0}}
          ]}
        ]}
      ]);
      var result = baServices.DecodeReadPropertyMultipleAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(Math.floor(0.1 * 10000)).to.equal(Math.floor(result.values[0].values[0].value[10].value * 10000));
      result.values[0].values[0].value[10].value = 0;
      expect(result).to.deep.equal({
        values: [{
          objectIdentifier: {
            type: 9,
            instance: 50000
          },
          values: [{
            propertyArrayIndex: 4294967295,
            propertyIdentifier: 81,
            value: [
              {type: 1, value: true},
              {type: 1, value: false},
              {type: 2, value: 1},
              {type: 2, value: 1000},
              {type: 2, value: 1000000},
              {type: 2, value: 1000000000},
              {type: 3, value: -1},
              {type: 3, value: -1000},
              {type: 3, value: -1000000},
              {type: 3, value: -1000000000},
              {type: 4, value: 0},
              {type: 5, value: 100.121212},
              {type: 7, value: 'Test1234$'},
              {type: 9, value: 4},
              {type: 10, value: date},
              {type: 11, value: time},
              {type: 12, value: {type: 3, instance: 0}}
            ]
          }]
        }]
      });
    });
  });

  describe('DeviceCommunicationControl', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeDeviceCommunicationControl(buffer, 30, 1);
      var result = baServices.DecodeDeviceCommunicationControl(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        timeDuration: 30,
        enableDisable: 1
      });
    });

    it('should successfully encode and decode with password', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeDeviceCommunicationControl(buffer, 30, 1, 'Test1234!');
      var result = baServices.DecodeDeviceCommunicationControl(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        timeDuration: 30,
        enableDisable: 1,
        password: 'Test1234!'
      });
    });
  });

  describe('ReinitializeDevice', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReinitializeDevice(buffer, 5);
      var result = baServices.DecodeReinitializeDevice(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        state: 5
      });
    });

    it('should successfully encode and decode with password', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeReinitializeDevice(buffer, 5, 'Test1234$');
      var result = baServices.DecodeReinitializeDevice(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        state: 5,
        password: 'Test1234$'
      });
    });
  });

  describe('TimeSync', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(990);
      baServices.EncodeTimeSync(buffer, date);
      var result = baServices.DecodeTimeSync(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        value: date,
      });
    });
  });

  describe('Error', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.EncodeError(buffer, 15, 25);
      var result = baServices.DecodeError(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        class: 15,
        code: 25
      });
    });
  });
});

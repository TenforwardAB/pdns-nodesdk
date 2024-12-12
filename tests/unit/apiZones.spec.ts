/**
 * This file is licensed under the European Union Public License (EUPL) v1.2.
 * You may only use this work in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed "as is",
 * without any warranty or conditions of any kind.
 *
 * Copyright (c) 2024- Tenforward AB. All rights reserved.
 *
 * Created on 12/12/24 :: 11:02AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiZones.spec.ts is part of the pdns-nodesdk project.
 */

import { Zones}  from "../../src/api/Zones";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Zones Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let zones: Zones;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        zones = new Zones(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("listZones calls the correct API endpoint", async () => {
        const mockResponse = [{ id: "example.org.", name: "example.org.", kind: "Native", serial: 12345, notified_serial: 12344, url: "/zones/example.org." }];
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const result = await zones.listZones("localhost");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost/zones");
        expect(result).toEqual(mockResponse);
    });

    test("getZone calls the correct API endpoint", async () => {
        const mockResponse = { id: "example.org.", name: "example.org.", kind: "Native", serial: 12345, notified_serial: 12344, rrsets: [] };
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const result = await zones.getZone("localhost", "example.org.");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost/zones/example.org.");
        expect(result).toEqual(mockResponse);
    });

    test("createZone sends the correct payload", async () => {
        const mockResponse = {
            account: "",
            api_rectify: false,
            dnssec: false,
            edited_serial: 2022040501,
            id: "example.org.",
            kind: "Native",
            last_check: null,
            master_tsig_key_ids: [],
            masters: [],
            name: "example.org.",
            notified_serial: 0,
            nsec3narrow: false,
            nsec3param: "",
            rrsets: [],
            serial: 2022040501,
            slave_tsig_key_ids: [],
            soa_edit: "",
            soa_edit_api: "DEFAULT",
            url: "/api/v1/servers/localhost/zones/example.org.",
        };
        const zoneData = { name: "example.org.", kind: "Native" };
        mockClient.post.mockResolvedValueOnce(mockResponse);

        const result = await zones.createZone("localhost", zoneData);

        expect(mockClient.post).toHaveBeenCalledWith("/servers/localhost/zones", zoneData);
        expect(result).toEqual(mockResponse);
    });

    test("deleteZone calls the correct API endpoint", async () => {
        mockClient.delete.mockResolvedValueOnce(undefined);

        await zones.deleteZone("localhost", "example.org.");

        expect(mockClient.delete).toHaveBeenCalledWith("/servers/localhost/zones/example.org.");
    });

    test("updateZoneRRsets sends the correct payload", async () => {
        const rrsetData = {
            rrsets: [
                {
                    name: "test.example.org.",
                    type: "A",
                    ttl: 3600,
                    changetype: "REPLACE",
                    records: [{ content: "192.168.0.5", disabled: false }],
                },
            ],
        };
        mockClient.patch.mockResolvedValueOnce(undefined);

        await zones.updateZoneRRsets("localhost", "example.org.", rrsetData);

        expect(mockClient.patch).toHaveBeenCalledWith("/servers/localhost/zones/example.org.", rrsetData);
    });

    test("modifyZone sends the correct payload", async () => {
        const zoneData = { kind: "Master", dnssec: true };
        mockClient.put.mockResolvedValueOnce(undefined);

        await zones.modifyZone("localhost", "example.org.", zoneData);

        expect(mockClient.put).toHaveBeenCalledWith("/servers/localhost/zones/example.org.", zoneData);
    });

    test("retrieveSlaveZone sends the correct payload", async () => {
        const body = {};
        mockClient.put.mockResolvedValueOnce(undefined);

        await zones.retrieveSlaveZone("localhost", "example.org.", body);

        expect(mockClient.put).toHaveBeenCalledWith("/servers/localhost/zones/example.org./axfr-retrieve", body);
    });

    test("sendNotify sends the correct payload", async () => {
        const body = {};
        mockClient.put.mockResolvedValueOnce(undefined);

        await zones.sendNotify("localhost", "example.org.", body);

        expect(mockClient.put).toHaveBeenCalledWith("/servers/localhost/zones/example.org./notify", body);
    });

    test("exportZone calls the correct API endpoint", async () => {
        const mockResponse = "example.org. IN SOA ns1.example.org. hostmaster.example.org. 2022040501 10800 3600 604800 3600";
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const result = await zones.exportZone("localhost", "example.org.");

        expect(mockClient.get).toHaveBeenCalledWith("/servers/localhost/zones/example.org./export");
        expect(result).toEqual(mockResponse);
    });

    test("rectifyZone sends the correct payload", async () => {
        const body = {};
        const mockResponse = { result: "Rectified" };
        mockClient.put.mockResolvedValueOnce(mockResponse);

        const result = await zones.rectifyZone("localhost", "example.org.", body);

        expect(mockClient.put).toHaveBeenCalledWith("/servers/localhost/zones/example.org./rectify", body);
        expect(result).toEqual(mockResponse);
    });
});

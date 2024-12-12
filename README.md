
# PowerDNS Node.js SDK or Simply pdns-nodesdk

A Node.js library for interacting with the PowerDNS API. This SDK simplifies operations with PowerDNS,
providing easy-to-use methods for managing servers, zones, cryptokeys, metadata, TSIG keys, and more.

![pdns-nodesdk_200x220.png](./resources/images/pdns-nodesdk_200x220.png)

Whether you're a seasoned developer or just starting out, `pdns-nodesdk` allows you to seamlessly integrate with
PowerDNS, giving you the power to manage DNS zones and configurations programmatically.

---

## Installation

Install the SDK via npm:

```bash
npm install pdns-nodesdk
```

---

## Usage

### Setting Up

Import the SDK and initialize it:

```typescript
import { PdnsNodeSDK } from "pdns-nodesdk";

const apiKey = "your-api-key";
const apiUrl = "http://localhost:8081/api/v1/"; // Update with your PowerDNS API URL

const pdns = new PdnsNodeSDK(apiKey, apiUrl);
```

### Example Use Cases

#### List All Servers

```typescript
(async () => {
    const serverList = await pdns.servers.listServers();
    console.log(serverList);
})();
```

#### Get Server Information

```typescript
(async () => {
    const serverId = "localhost";
    const serverInfo = await pdns.servers.getServer(serverId);
    console.log(serverInfo);
})();
```

#### Create a New Zone

```typescript
(async () => {
    const serverId = "localhost";
    const zoneData = {
        name: "example.org.",
        kind: "Master",
        nameservers: ["ns1.example.org.", "ns2.example.org."]
    };

    const newZone = await pdns.zones.createZone(serverId, zoneData);
    console.log(newZone);
})();
```

#### Modify Zone RRsets

```typescript
(async () => {
    const serverId = "localhost";
    const zoneId = "example.org.";
    const rrsetData = {
        rrsets: [
            {
                name: "www.example.org.",
                type: "A",
                ttl: 3600,
                changetype: "REPLACE",
                records: [
                    { content: "192.0.2.1", disabled: false }
                ]
            }
        ]
    };

    await pdns.zones.updateZoneRRsets(serverId, zoneId, rrsetData);
})();
```

#### Delete a Zone

```typescript
(async () => {
    const serverId = "localhost";
    const zoneId = "example.org.";

    await pdns.zones.deleteZone(serverId, zoneId);
})();
```

#### Create a Cryptokey

```typescript
(async () => {
    const serverId = "localhost";
    const zoneId = "example.org.";
    const keyData = {
        keytype: "KSK",
        active: true,
        algorithm: "ECDSAP256SHA256",
        bits: 256
    };

    const cryptokey = await pdns.cryptokeys.createKey(serverId, zoneId, keyData);
    console.log(cryptokey);
})();
```

#### Flush Cache

```typescript
(async () => {
    const serverId = "localhost";
    const domain = "example.org.";

    const cacheFlushResult = await pdns.cache.flushCache(serverId, domain);
    console.log(cacheFlushResult);
})();
```

---

## Advanced Usage

### Custom Configuration

You can modify the client’s behavior by passing additional headers or configuring timeouts:

```typescript
const pdns = new PdnsNodeSDK(apiKey, apiUrl, {
    headers: { "Custom-Header": "value" },
    timeout: 5000 // 5 seconds
});
```

### Error Handling

Handle API errors using try-catch blocks:

```typescript
(async () => {
    try {
        const serverInfo = await pdns.servers.getServer("invalid-server");
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## Testing

### Integration Tests

We encourage the community to contribute more integration test cases to cover additional scenarios. Comprehensive testing ensures the reliability and robustness of this SDK.

Run integration tests for the SDK:

```bash
npm run test:integration
```

### Using Docker for Testing

To facilitate integration tests, we provide a Docker setup for spinning up a minimal PowerDNS instance with SQLite as the backend. This container mimics a real PowerDNS server and allows you to test the SDK in a controlled environment.

#### Start the Docker Container

Use the following command to spin up the container:

```bash
npm run start:docker:test
```

This command starts a container with PowerDNS configured to use an SQLite database. The configuration includes an example zone to ensure the tests run smoothly.

#### Stop the Docker Container

After running your tests, clean up by stopping the container:

```bash
npm run stop:docker:test
```

---

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for bugs or feature requests.

---

## License

This project is licensed under the [EUPL v1.2](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12).
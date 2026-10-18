# Overview
The registration process is based on the [OPAQUE Spec](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-opaque-14) and 
implemented with [opaque-ke](https://github.com/facebook/opaque-ke). [Serenity-kit/opaque](https://github.com/serenity-kit/opaque) 
is used to allow for the Rust crate to be bundled with and used inside the backend's Node runtime package.

# OPAQUE Registration
```mermaid
sequenceDiagram
    actor User
    participant Client
    participant Server
    participant Cache
    participant Database
    User->>+Client: username, password
    Client->>+Server: blinded password,<br/>username
    Server->>+Cache: registration state<br/>keyed by username<br/>(short-lived)
    Cache-->>-Server: success
    Server-->>-Client: registration data,<br/>registration token 
    Client->>+Server: registration record,<br/>username,<br/>registration token
    Server->>+Cache: get registration state
    Cache-->>-Server: registration state
    Server->>+Cache: delete registration state
    Cache-->>-Server: success
    Server->>+Database: save auth package
    Database-->>-Server: success
    Server-->>-Client: success
    deactivate Client
```

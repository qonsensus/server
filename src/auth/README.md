# Overview
The registration process is based on the [OPAQUE Spec](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-opaque-14) and 
implemented with [opaque-ke](https://github.com/facebook/opaque-ke). [Serenity-kit/opaque](https://github.com/serenity-kit/opaque) 
is used to allow for the Rust crate to be bundled with and used inside the backend's Node runtime package.

# OPAQUE Registration
```mermaid
sequenceDiagram
    actor User
    participant Web Client
    participant Qonsensus Server
    participant Cache
    participant PostgreSQL
    User->>+Web Client: username, password
    Web Client->>+Qonsensus Server: blinded password,<br/>username
    Qonsensus Server->>+Cache: registration state<br/>keyed by username<br/>(short-lived)
    Cache-->>-Qonsensus Server: success
    Qonsensus Server-->>-Web Client: registration data,<br/>registration token 
    Web Client->>+Qonsensus Server: registration record,<br/>username,<br/>registration token
    Qonsensus Server->>+Cache: get registration state
    Cache-->>-Qonsensus Server: registration state
    Qonsensus Server->>+Cache: delete registration state
    Cache-->>-Qonsensus Server: success
    Qonsensus Server->>+PostgreSQL: save auth package
    PostgreSQL-->>-Qonsensus Server: success
    Qonsensus Server-->>-Web Client: success
    deactivate Web Client
```

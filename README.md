# Vulnerability Scanner Benchmark Suite

This repository contains intentional vulnerability patterns across multiple difficulty tiers to evaluate AST static analysis scanner precision and depth.

## Difficulty Branches
1. **`very-easy`**: Direct single-statement sinks (`innerHTML = ... + ...`, `execSync(...)`, `db.query(...)`).
2. **`easy`**: Intermediate variables and template string interpolation (`${...}`).
3. **`medium`**: Inter-procedural flow, function parameters, and wrapper abstractions.
4. **`hard`**: Destructured / aliased imports, computed property names, and array joins.
5. **`extremely-hard`**: Curried functions, higher-order closures, and dynamic method dispatch.
6. **`insane`**: Proxy interceptors, custom tagged template simulators, and Function constructors.

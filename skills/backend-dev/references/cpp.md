# C/C++ Development Standards

> Patterns and best practices for C and C++ development.
> Covers: Modern C++ (C++17/20/23), CMake, memory safety, testing.

---

## Official C++ References

- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- C++23 reference: https://en.cppreference.com/w/cpp/23
- `std::span`: https://en.cppreference.com/w/cpp/container/span
- CMake tutorial: https://cmake.org/cmake/help/latest/guide/tutorial/index.html
- GoogleTest CMake quickstart: https://google.github.io/googletest/quickstart-cmake.html

## Modern C++ Standards

### Prefer C++17+ Features

| Feature | Use Instead Of |
|---------|---------------|
| `std::optional<T>` | Null pointers, sentinel values |
| `std::variant<T...>` | Unions, type-unsafe alternatives |
| `std::string_view` | `const std::string&` for read-only |
| `std::filesystem` | Platform-specific file APIs |
| `if constexpr` | SFINAE for compile-time branching |
| Structured bindings | `std::get<>()` on tuples/pairs |
| `[[nodiscard]]` | Unmarked return values |

### C++20 Additions

| Feature | Purpose |
|---------|---------|
| Concepts | Constrain templates readably |
| Ranges | Composable algorithms |
| Coroutines | Async without callbacks |
| `std::format` | Type-safe string formatting |
| Modules | Replace headers (when supported) |
| `std::span<T>` | Non-owning view of contiguous data |

---

## Memory Safety

### RAII (Resource Acquisition Is Initialization)

```cpp
// ✅ CORRECT — RAII with smart pointers
auto user = std::make_unique<User>("John", "john@example.com");
auto shared = std::make_shared<Connection>(config);

// ❌ WRONG — raw new/delete
User* user = new User("John", "john@example.com");
// ... if exception thrown here, memory leaks
delete user;
```

### Smart Pointer Guidelines

| Type | When to Use |
|------|-------------|
| `std::unique_ptr<T>` | Single ownership (default choice) |
| `std::shared_ptr<T>` | Shared ownership (use sparingly) |
| `std::weak_ptr<T>` | Break circular references |
| Raw pointer `T*` | Non-owning observer only (never delete) |

### Rule of Zero/Five

```cpp
// Rule of Zero — prefer this (let compiler generate)
class User {
    std::string name;
    std::string email;
    // No destructor, copy/move constructors needed
};

// Rule of Five — only when managing raw resources
class Buffer {
    char* data;
    size_t size;
public:
    Buffer(size_t n) : data(new char[n]), size(n) {}
    ~Buffer() { delete[] data; }
    Buffer(const Buffer& other);            // Copy constructor
    Buffer& operator=(const Buffer& other); // Copy assignment
    Buffer(Buffer&& other) noexcept;        // Move constructor
    Buffer& operator=(Buffer&& other) noexcept; // Move assignment
};
```

---

## Project Structure (CMake)

```text
project/
├── CMakeLists.txt          # Root CMake
├── src/
│   ├── CMakeLists.txt
│   ├── main.cpp
│   └── lib/
│       ├── user.h
│       └── user.cpp
├── tests/
│   ├── CMakeLists.txt
│   └── user_test.cpp
├── include/                # Public headers
│   └── project/
│       └── api.h
└── third_party/            # External dependencies
    └── CMakeLists.txt
```

### CMakeLists.txt (Modern CMake)

Prefer target-based CMake. Set compile features and include paths on targets,
not through broad global flags.

```cmake
cmake_minimum_required(VERSION 3.20)
project(MyProject VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Library
add_library(mylib
    src/lib/user.cpp
)
target_include_directories(mylib PUBLIC include)

# Executable
add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE mylib)

# Tests
enable_testing()
add_subdirectory(tests)
```

---

## Error Handling

### Prefer Exceptions for Recoverable Errors

```cpp
// ✅ Exception-based (C++ idiomatic)
class NotFoundException : public std::runtime_error {
public:
    explicit NotFoundException(const std::string& msg)
        : std::runtime_error(msg) {}
};

User findUser(int id) {
    auto it = users.find(id);
    if (it == users.end()) {
        throw NotFoundException("User not found: " + std::to_string(id));
    }
    return it->second;
}
```

### Use std::expected (C++23) or Result Pattern

```cpp
// C++23 std::expected
std::expected<User, Error> findUser(int id) {
    auto it = users.find(id);
    if (it == users.end()) {
        return std::unexpected(Error::NotFound);
    }
    return it->second;
}

// Usage
auto result = findUser(42);
if (result) {
    process(*result);
} else {
    handleError(result.error());
}
```

---

## Testing (GoogleTest)

```cpp
#include <gtest/gtest.h>
#include "project/user.h"

class UserTest : public ::testing::Test {
protected:
    void SetUp() override {
        user = std::make_unique<User>("John", "john@example.com");
    }
    std::unique_ptr<User> user;
};

TEST_F(UserTest, ConstructsWithCorrectName) {
    EXPECT_EQ(user->name(), "John");
}

TEST_F(UserTest, ThrowsOnInvalidEmail) {
    EXPECT_THROW(User("Jane", "invalid"), std::invalid_argument);
}

TEST_F(UserTest, EqualityComparison) {
    User other("John", "john@example.com");
    EXPECT_EQ(*user, other);
}
```

### CMake Test Setup

```cmake
# tests/CMakeLists.txt
include(FetchContent)
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
)
FetchContent_MakeAvailable(googletest)

add_executable(tests user_test.cpp)
target_link_libraries(tests PRIVATE mylib GTest::gtest_main)

include(GoogleTest)
gtest_discover_tests(tests)
```

---

## Build & Run

```bash
# Configure
cmake -B build -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build build --parallel

# Run tests
cd build && ctest --output-on-failure

# Install
cmake --install build --prefix /usr/local
```

---

## Performance Guidelines

- Use `std::move()` for transferring ownership (avoid copies)
- Use `reserve()` on vectors when size is known
- Prefer stack allocation over heap (`std::array` over `std::vector` for fixed sizes)
- Use `constexpr` for compile-time computation
- Profile before optimizing (use Valgrind, perf, or sanitizers)

---

## Safety Tools

```bash
# Address Sanitizer (memory errors)
cmake -B build -DCMAKE_CXX_FLAGS="-fsanitize=address -fno-omit-frame-pointer"

# Thread Sanitizer (data races)
cmake -B build -DCMAKE_CXX_FLAGS="-fsanitize=thread"

# Undefined Behavior Sanitizer
cmake -B build -DCMAKE_CXX_FLAGS="-fsanitize=undefined"

# Static analysis
clang-tidy src/*.cpp --checks='*,-fuchsia-*'
```

---

## C-Specific Notes (When Writing Pure C)

- Use C11 or C17 standard
- Always check return values of `malloc()`, `fopen()`, etc.
- Use `static` for file-scoped functions (internal linkage)
- Prefer `size_t` for sizes and indices
- Use `const` liberally
- Free resources in reverse order of allocation
- Use `valgrind` to detect memory leaks

```c
// C pattern: cleanup with goto
int process_file(const char* path) {
    FILE* f = fopen(path, "r");
    if (!f) return -1;

    char* buf = malloc(1024);
    if (!buf) goto cleanup_file;

    // ... process ...

    free(buf);
cleanup_file:
    fclose(f);
    return 0;
}
```

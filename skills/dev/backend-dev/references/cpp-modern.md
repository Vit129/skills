# Modern C and C++ Reference

Use this reference for C/C++ work with Modern C++, CMake, RAII, memory safety,
GoogleTest, sanitizers, concurrency, and performance-sensitive code.

Read `cpp.md` first for local patterns, then apply this file for current C++ and
tooling rules.

## Official Documentation Anchors

- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- ISO C++ guidelines entrypoint: https://isocpp.org/guidelines
- C++23 reference: https://en.cppreference.com/w/cpp/23
- `std::span`: https://en.cppreference.com/w/cpp/container/span
- CMake tutorial: https://cmake.org/cmake/help/latest/guide/tutorial/index.html
- CMake GoogleTest module: https://cmake.org/cmake/help/latest/module/GoogleTest.html
- GoogleTest CMake quickstart: https://google.github.io/googletest/quickstart-cmake.html

## Language Rules

- Prefer the project standard; if starting new code, C++20 is a conservative
  default and C++23 is acceptable when compiler support is verified.
- Prefer Rule of Zero and RAII.
- Prefer `std::unique_ptr` for ownership and raw pointers/references for
  non-owning observation.
- Use `std::span` for non-owning contiguous ranges.
- Use `std::optional`, `std::variant`, and `std::expected` where the selected
  language standard and compiler support them.
- Avoid macros for type-safe logic when templates, constexpr, or functions work.

## CMake Rules

- Use target-based CMake.
- Prefer `target_link_libraries`, `target_include_directories`, and
  `target_compile_features` over global flags.
- Keep public headers and private implementation boundaries explicit.
- Add tests through CTest and GoogleTest discovery when the project uses
  GoogleTest.

## Safety Rules

- No raw `new`/`delete` in new application code unless wrapping a low-level C API
  and immediately transferring ownership into RAII.
- No unchecked buffer access in security-sensitive code.
- Use sanitizers for memory/thread issues when available.
- Treat undefined behavior as a release blocker.

## Testing and Verification

- Use GoogleTest or the project test framework.
- Run CTest after builds when configured.
- Run ASan/UBSan/TSan where practical for risky memory or concurrency changes.
- Profile before performance refactors.

## Review Checklist

- Ownership is explicit and RAII-managed.
- Interfaces distinguish owning and non-owning data.
- CMake uses targets, not global mutable flags.
- Tests cover edge cases, error paths, and resource lifetime.
- Sanitizers or static analysis are used for memory-sensitive changes.

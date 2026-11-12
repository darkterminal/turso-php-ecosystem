![Turso PHP Ecosystem](https://i.imgur.com/EJTo6Zo.png)

<p align="center">
  <a href="https://discord.gg/turso">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://i.imgur.com/UhuW3zm.png">
      <source media="(prefers-color-scheme: light)" srcset="https://i.imgur.com/vljWbfr.png">
      <img alt="Shows a black logo in light color mode and a white one in dark color mode." src="https://i.imgur.com/vGCC0I4.png">
    </picture>
  </a>
</p>

# Turso PHP Ecosystem

This repository is the overview of the Turso SDK family for PHP that I develop and maintain — the installer, the native extension, the HTTP client, a fully typed Platform API client, and the Laravel/Symfony integrations. Everything listed below is current as of November 2026, published on GitHub (and Packagist where applicable), and covered by CI.

## Table of Contents

- [Turso PHP Ecosystem](#turso-php-ecosystem)
  - [At a glance](#at-a-glance)
  - [Extension Installer](#extension-installer)
  - [Native Extension](#native-extension)
  - [HTTP Client](#http-client)
  - [Platform API](#platform-api)
  - [Laravel](#laravel)
    - [Laravel Packages](#laravel-packages)
  - [Symfony](#symfony)
    - [Symfony Packages](#symfony-packages)
  - [Quality & verification](#quality--verification)

## At a glance

| Package | Description | Latest | Requires |
|---|---|---|---|
| [`darkterminal/turso-php-installer`](https://github.com/darkterminal/turso-php-installer) | Installer script for the libSQL native extension (Linux/macOS) | 2.2.2 | PHP 8.2+ |
| [Turso Client PHP](https://github.com/tursodatabase/turso-client-php) | libSQL native extension (upstream, community SDK) | ext v1.7.0 | PHP + libSQL ext |
| [`darkterminal/turso-client-http`](https://github.com/darkterminal/turso-client-http) | HTTP client (Hrana-over-HTTP) | 3.0.1 | PHP ^8.3 |
| [`darkterminal/turso-api-client-php`](https://github.com/darkterminal/turso-api-client-php) | Typed Platform API client (OpenAPI-pinned, 53/53 ops) | 2.1.0 | PHP ^8.3 |
| [`darkterminal/turso-platform-laravel`](https://github.com/darkterminal/turso-platform-laravel) | Laravel adapter for the Platform API SDK (Facade, config publish) | 1.1.0 | PHP 8.3, Laravel 12 |
| [`tursodatabase/turso-driver-laravel`](https://github.com/tursodatabase/turso-driver-laravel) | Laravel driver over native libSQL | 1.7.0 | PHP ^8.2 + libSQL ext |
| [`darkterminal/turso-http-laravel`](https://github.com/darkterminal/turso-http-laravel) | Laravel wrapper for the HTTP client | 1.0.1 | PHP + Laravel |
| [`tursodatabase/turso-doctrine-dbal`](https://github.com/tursodatabase/turso-doctrine-dbal) | Doctrine DBAL driver over native libSQL | 1.5.0 | PHP ^8.2 + libSQL ext |

## Extension Installer

The easy way to install, update, or uninstall the libSQL native extension for PHP (Linux and macOS, PHP 8.2+). It reads the latest extension release automatically and currently covers PHP 8.1–8.5 (NTS and TS builds).

```bash
composer global require darkterminal/turso-php-installer
```

- [Turso PHP Installer](https://github.com/darkterminal/turso-php-installer)

## Native Extension

- [Turso Client PHP](https://github.com/tursodatabase/turso-client-php) - Turso + PHP - libSQL Extension for PHP (upstream, community SDK)

Development and issue tracking happen on the upstream repository. The extension can be installed and updated with [Turso PHP Installer](https://github.com/darkterminal/turso-php-installer).

## HTTP Client

Pure-PHP client for Turso over HTTP (Hrana-over-HTTP) — no extension required.

```bash
composer require darkterminal/turso-client-http:^3.0
```

- [Turso Client HTTP](https://github.com/darkterminal/turso-client-http) - The PHP library for Turso over HTTP (v3, PHP ^8.3)

## Platform API

Typed, resource-oriented client built against the pinned OpenAPI snapshot — **53/53 operations implemented and covered by automated tests**. PSR-18/PSR-17/PSR-7 composition, PHPStan level 6, and a CI matrix across PHP 8.3/8.4/8.5. v3 recovery operations require an organization UUID (`withOrganizationId()`). Database-upload integrations (`Integrations\DatabaseUploader`, `Integrations\RegionResolver`) are live-verified end-to-end against Turso Cloud (scratch database, upload, read-back, cleanup — PHP 8.3/8.4/8.5, 2026-11).

```bash
composer require darkterminal/turso-api-client-php:^2.1
```

- [Turso API Client PHP](https://github.com/darkterminal/turso-api-client-php)

## Laravel

Here is the list of Laravel packages that I have created.

### Laravel Packages

- [Turso Driver Laravel](https://github.com/tursodatabase/turso-driver-laravel) - Turso Driver for Laravel with Native libSQL <sup>([Required](#native-extension))</sup>
- [Turso Platform Laravel](https://github.com/darkterminal/turso-platform-laravel) - Laravel integration for the **Turso Platform API** SDK: auto-discovered Service Provider, publishable config (`turso-platform-config`), `TursoPlatform` Facade — `composer require darkterminal/turso-platform-laravel`
- [Turso HTTP Laravel](https://github.com/darkterminal/turso-http-laravel) - Turso / libSQL HTTP SDK for Laravel

## Symfony

Here is the list of Symfony packages/integrations that I have created.

### Symfony Packages

- [Turso Doctrine DBAL](https://github.com/tursodatabase/turso-doctrine-dbal) - A LibSQL Driver for Doctrine DBAL with Native libSQL <sup>([Required](#native-extension))</sup>

## Quality & verification

- Every client in this family ships with automated tests in CI (GitHub Actions, matrix across PHP 8.3/8.4/8.5).
- Static analysis: PHPStan at level 6 for `turso-api-client-php` and `turso-platform-laravel`.
- `turso-api-client-php` is pinned to a frozen OpenAPI snapshot plus a coverage manifest (53/53 operations mapped to resources).
- Live end-to-end proof harnesses (Docker) verified SQLite-dump uploads against Turso Cloud from PHP 8.3/8.4/8.5, 2026-11.
- The Laravel adapter is verified with Orchestra Testbench (7 tests / 14 assertions) on PHP 8.3/8.4/8.5 × Laravel 12.
- Docs for `turso-api-client-php` and `turso-platform-laravel` are mirrored as wikis (repo `docs/` is the source of truth) — API map, architecture notes, troubleshooting.

---

<p align="center">
    &mdash; <a href="https://github.com/darkterminal">darkterminal</a> / <a href="https://x.com/panggilmeiam" target="_blank">panggilmeiam</a> (<em>Software Freestyle Engineer</em>), btw &mdash;
</p>
<p align="center">
    People call me "crazy" and that's true. Because I work Full-time for Open Source <br />
    (Support me is not illegal <a href="https://github.com/sponsors/darkterminal">GitHub Sponsor</a> or <a href="https://saweria.co/darkterminal" target="_blank">Saweria</a>)
</p>

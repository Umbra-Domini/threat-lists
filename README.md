# threat-lists

Plain-text lists used by the [Unmask](https://github.com/Umbra-Domini) Link inspector and the NullTrace browser extension to spot IP loggers and look-alike scam links.

## Files

| File | What it holds | Format |
| --- | --- | --- |
| `domains.txt` | Domains of IP logger and grabber services (Grabify, iplogger and similar) | One domain per line. Subdomains match automatically. |
| `brands.txt` | Well-known brands, used to catch look-alike domains | `name,domain` per line, for example `paypal,paypal.com` |

Lines starting with `#` are comments. Everything is lowercase.

## Using the lists

Both tools read the raw files and keep a built-in copy as a fallback:

```
https://raw.githubusercontent.com/Umbra-Domini/threat-lists/main/domains.txt
https://raw.githubusercontent.com/Umbra-Domini/threat-lists/main/brands.txt
```

The lists are data only. Never run anything from them.

## Adding to a list

Open an issue or a pull request with the domain and, if you can, where you saw it. For `brands.txt`, skip brands whose name is an ordinary word, since those cause false alarms.

## Limits

These lists are not complete and new domains appear all the time. A domain missing here is not proof it is safe.

## License

Free to use and copy. Released under CC0 1.0 (public domain).

# Thermo Automation

This is a self-hostable project to automate Daikin thermometers.

## Info

[Daikin One API Documentation](https://www.daikinone.com/openapi/documentation/index.html)

## TODO

- [ ] Shimmer in the breadcrumb for device name
- [ ] Move cron into separate service in the Dockerfile
  - [ ] Start cron service when running `pnpm dev` (?)
- [ ] Fix the classic timezone issue 🙄
- [ ] Add a temporary override option with: setpoints, optional buffer (1 or 2?), optional duration (selection or input?)

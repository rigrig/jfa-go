![jfa-go](images/banner.svg)
[![Build Status](https://drone.hrfee.dev/api/badges/hrfee/jfa-go/status.svg?ref=refs/heads/main)](https://drone.hrfee.dev/hrfee/jfa-go)
[![Docker Hub](https://img.shields.io/docker/pulls/hrfee/jfa-go?label=docker)](https://hub.docker.com/r/hrfee/jfa-go)
[![Translation status](https://weblate.hrfee.pw/widgets/jfa-go/-/svg-badge.svg)](https://weblate.hrfee.pw/engage/jfa-go/)
---
jfa-go is a user management app for [Jellyfin](https://github.com/jellyfin/jellyfin) (and now [Emby](https://emby.media/)) that provides invite-based account creation as well as other features that make one's instance much easier to manage.

I chose to rewrite the python [jellyfin-accounts](https://github.com/hrfee/jellyfin-accounts) in Go mainly as a learning experience, but also to slightly improve speeds and efficiency.

#### Features
* 🧑 Invite based account creation: Sends invites to your friends or family, and let them choose their own username and password without relying on you.
    * Send invites via a link and/or email
    * Granular control over invites: Validity period as well as number of uses can be specified.
    * Account profiles: Assign settings profiles to invites so new users have your predefined permissions, homescreen layout, etc. applied to their account on creation.
    * Password validation: Ensure users choose a strong password.
* 🔗 Ombi Integration: Automatically creates Ombi accounts for new users using their email address and login details, and your own defined set of permissions.
* Account management: Apply settings to your users individually or en masse, and delete users, optionally sending them an email notification with a reason.
* 📨 Email storage: Add your existing users email addresses through the UI, and jfa-go will ask new users for them on account creation.
    * Email addresses can optionally be used instead of usernames
* 🔑 Password resets: When user's forget their passwords and request a change in Jellyfin, jfa-go reads the PIN from the created file and sends it straight to the user via email.
* Notifications: Get notified when someone creates an account, or an invite expires.
* Authentication via Jellyfin: Instead of using separate credentials for jfa-go and Jellyfin, jfa-go can use it as the authentication provider.
    * Enables the usage of jfa-go by multiple people
* 🌓 Customizable look
    * Specify contact and help messages to appear in emails and pages
    * Light and dark themes available

#### Interface
<p align="center">
    <img src="images/demo.gif" width="100%"></img>
</p>

<p align="center">
    <img src="images/invites.png" width="48%" style="margin-left: 1.5%;" alt="Invites tab"></img>
    <img src="images/accounts.png" width="48%" style="margin-right: 1.5%;" alt="Accounts tab"></img> 
</p>

#### Install

Available on the AUR as [jfa-go](https://aur.archlinux.org/packages/jfa-go/) or [jfa-go-git](https://aur.archlinux.org/packages/jfa-go-git/).

For other platforms, grab an archive from the release section for your platform (or nightly builds [here](https://builds.hrfee.dev/view/hrfee/jfa-go)), and extract the `jfa-go` executable to somewhere useful.
* For \*nix/macOS users, `chmod +x jfa-go` then place it somewhere in your PATH like `/usr/bin`.

Run the executable to start.

For [docker](https://hub.docker.com/repository/docker/hrfee/jfa-go), run: 
```
docker create \
             --name "jfa-go" \ # Whatever you want to name it
             -p 8056:8056 \
            # -p 8057:8057 if using tls
             -v /path/to/.config/jfa-go:/data \ # Path to wherever you want to store the config file and other data
             -v /path/to/jellyfin:/jf \ # Path to jellyfin config directory
             -v /etc/localtime:/etc/localtime:ro \ # Makes sure time is correct
             hrfee/jfa-go # hrfee/jfa-go:unstable for latest build from git
```

#### Build from source
If you're using docker, a Dockerfile is provided that builds from source.

Otherwise, full build instructions can be found [here](https://github.com/hrfee/jfa-go/wiki/Build).

#### Usage
Simply run `jfa-go` to start the application. A setup wizard will start on `localhost:8056` (or your own specified address). Upon completion, refresh the page.

Note: jfa-go does not run as a daemon by default. You'll need to figure this out yourself.

```
Usage of ./jfa-go:
  -config string
    	alternate path to config file. (default "~/.config/jfa-go/config.ini")
  -data string
    	alternate path to data directory. (default "~/.config/jfa-go")
  -debug
    	Enables debug logging and exposes pprof.
  -host string
    	alternate address to host web ui on.
  -port int
    	alternate port to host web ui on.
  -swagger
    	Enable swagger at /swagger/index.html
```

If you're switching from jellyfin-accounts, copy your existing `~/.jf-accounts` to:

* `XDG_CONFIG_DIR/jfa-go` (usually ~/.config/jfa-go) on \*nix systems, 
* `%AppData%/jfa-go` on Windows,
* `~/Library/Application Support/jfa-go` on macOS.

(or specify config/data path  with `-config/-data` respectively.)

#### Contributing
See [CONTRIBUTING.md](https://github.com/hrfee/jfa-go/blob/main/CONTRIBUTING.md).
##### Translation
[![Translation status](https://weblate.hrfee.pw/widgets/jfa-go/-/multi-auto.svg)](https://weblate.hrfee.pw/engage/jfa-go/)

For translations, use the weblate instance [here](https://weblate.hrfee.pw/engage/jfa-go/). You can login with github.

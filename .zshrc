
. "$HOME/.local/bin/env"
eval "$(uv generate-shell-completion zsh)"



# Zero CLI
export PATH="$HOME/.zero/bin:$PATH"


# Added by Antigravity CLI installer
export PATH="/Users/davidtphung/.local/bin:$PATH"


# >>> grok installer >>>
export PATH="$HOME/.grok/bin:$PATH"
fpath=(~/.grok/completions/zsh $fpath)
autoload -Uz compinit && compinit -C
# <<< grok installer <<<

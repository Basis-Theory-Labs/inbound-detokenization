terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 0.7.0"
    }
  }
}

variable "management_api_key" {}

// Management application API Key
provider "basistheory" {
  api_key = var.management_api_key
}

resource "basistheory_application" "proxy_application" {
  name        = "Proxy Application"
  type        = "private"
  rule {
    description = "Read Tokens"
    priority    = 1
    container   = "/general/"
    transform   = "reveal"
    permissions = [
      "token:read",
    ]
  }
}

resource "basistheory_proxy" "inbound_proxy" {
  name               = "Inbound Proxy"
  destination_url    = "https://echo.basistheory.com/anything" // replace this with your API endpoint
  application_id     = basistheory_application.proxy_application.id
  response_transform = {
    code = file("./detokenize.js")
  }
  require_auth = false
}

output "inbound_proxy_key" {
  value       = basistheory_proxy.inbound_proxy.key
  description = "Inbound Proxy Key"
  sensitive   = true
}
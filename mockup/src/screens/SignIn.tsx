import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Separator,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Network, Loader2, Github, ArrowRight } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("valentin@thinkware.fr");
  const [password, setPassword] = useState("demo-password");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/dashboard"), 600);
  }

  return (
    <Flex
      className="min-h-full"
      style={{ background: "var(--gray-2)" }}
    >
      {/* Left: form */}
      <Flex
        direction="column"
        px={{ initial: "6", sm: "9" }}
        py="9"
        className="flex-1"
      >
        <Link to="/" className="flex items-center gap-2">
          <Flex
            align="center"
            justify="center"
            className="h-8 w-8 rounded-[var(--radius-3)] text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-9), var(--accent-11))",
            }}
          >
            <Network className="h-4 w-4" />
          </Flex>
          <Text size="2" weight="bold">
            Ontologia
          </Text>
        </Link>

        <Box className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <Heading size="6" weight="bold" mb="2">
            Sign in to your workspace
          </Heading>
          <Text size="2" color="gray">
            Welcome back. Enter your credentials to access your ontologies.
          </Text>

          <Box mt="5">
            <Flex gap="2" className="grid grid-cols-2">
              <Button variant="surface" color="gray" size="2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.33v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.11Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.83Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 6.68 9.14 4.75 12 4.75Z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="surface" color="gray" size="2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </Flex>
          </Box>

          <Flex align="center" gap="3" my="5">
            <Separator size="4" />
            <Text size="1" color="gray" weight="medium" className="uppercase tracking-wider">
              or
            </Text>
            <Separator size="4" />
          </Flex>

          <form onSubmit={submit}>
            <Flex direction="column" gap="3">
              <Box>
                <Text as="label" size="1" weight="bold" color="gray" mb="1" className="block">
                  Work email
                </Text>
                <TextField.Root
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  size="2"
                />
              </Box>
              <Box>
                <Flex align="center" justify="between" mb="1">
                  <Text as="label" size="1" weight="bold" color="gray">
                    Password
                  </Text>
                  <a
                    href="#"
                    className="text-xs font-medium"
                    style={{ color: "var(--accent-11)" }}
                  >
                    Forgot?
                  </a>
                </Flex>
                <TextField.Root
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  size="2"
                />
              </Box>
              <Button
                type="submit"
                size="3"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </Flex>
          </form>

          <Text size="2" color="gray" mt="5" align="center" as="p">
            New to Ontologia?{" "}
            <a
              href="#"
              className="font-semibold"
              style={{ color: "var(--accent-11)" }}
            >
              Create a workspace
            </a>
          </Text>
        </Box>

        <Flex
          align="center"
          justify="between"
          className="mx-auto w-full max-w-sm"
        >
          <Text size="1" color="gray">
            © 2026 Thinkware SAS
          </Text>
          <Flex gap="3">
            <Text size="1" color="gray" asChild>
              <a href="#" className="hover:underline">
                Privacy
              </a>
            </Text>
            <Text size="1" color="gray" asChild>
              <a href="#" className="hover:underline">
                Terms
              </a>
            </Text>
            <Text size="1" color="gray" asChild>
              <a href="#" className="hover:underline">
                Status
              </a>
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Right: marketing panel */}
      <Box
        className="relative hidden flex-1 overflow-hidden lg:block"
        style={{
          background:
            "linear-gradient(135deg, var(--violet-10), var(--violet-12) 70%, var(--violet-12))",
        }}
      >
        {/* subtle grid */}
        <Box
          className="absolute inset-0"
          style={{
            opacity: 0.3,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <Flex
          direction="column"
          justify="between"
          className="relative h-full text-white"
          p="9"
        >
          <Box className="max-w-md">
            <Badge color="green" variant="surface" size="2" radius="full">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-9)]" />
              Private beta — April 2026
            </Badge>
            <Heading
              size="8"
              weight="bold"
              mt="5"
              style={{ color: "white", lineHeight: 1.15 }}
            >
              The ontology platform for teams building knowledge-rich AI products.
            </Heading>
            <Text size="3" mt="4" as="p" style={{ color: "var(--violet-3)" }}>
              Version your concepts and relations, review changes, and ship the
              right schema to your RAG pipeline — without the enterprise
              graph-DB tax.
            </Text>
          </Box>

          <Card
            variant="surface"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Box p="3">
              <Text
                as="p"
                size="2"
                style={{ color: "var(--violet-1)", lineHeight: 1.5 }}
              >
                "We consolidated four scattered Google Sheets into a single source
                of truth for our product taxonomy. Ontologia is the first tool
                that feels built for AI teams, not database admins."
              </Text>
              <Flex align="center" gap="3" mt="3">
                <Flex
                  align="center"
                  justify="center"
                  className="h-7 w-7 rounded-full font-semibold text-white"
                  style={{ background: "var(--green-9)" }}
                >
                  CM
                </Flex>
                <Box>
                  <Text size="1" weight="bold" style={{ color: "white" }}>
                    Claire Moreau
                  </Text>
                  <Text
                    as="p"
                    size="1"
                    style={{ color: "var(--violet-3)" }}
                  >
                    Head of AI, Aurelia Retail
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Card>
        </Flex>
      </Box>
    </Flex>
  );
}

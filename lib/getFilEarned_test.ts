import { assert, assertStrictEquals } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import getFilEarned, { getContractBalanceHeld, formatAttoFil} from "./getFilEarned.ts";

Deno.test({
  name: "getFilEarned",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn () {
    const filEarned = await getFilEarned()
    assert(filEarned > 0n)
  }
})

Deno.test({
  name: "getContractBalanceHeld",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn () {
    const balanceHeld = await getContractBalanceHeld()
    assert(balanceHeld > 0n)
  }
})

Deno.test({
  name: "formatAttoFil",
  sanitizeOps: false,
  sanitizeResources: false,
  fn () {
    assertStrictEquals(formatAttoFil(0n), "0")
    assertStrictEquals(formatAttoFil(10n ** 18n), "1")
    assertStrictEquals(formatAttoFil(10n ** 18n + 1n), "1")
  }
})

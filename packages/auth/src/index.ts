import { AbilityBuilder, CreateAbility, MongoAbility, createMongoAbility } from "@casl/ability";
import { z } from "zod";
import { User } from "./models/User";
import { permissions } from "./permissions";
import { billingSubject } from "./subjects/billing";
import { inviteSubject } from "./subjects/invite";
import { organizationSubject } from "./subjects/organization";
import { projectSubject } from "./subjects/project";
import { userSubject } from "./subjects/user";

export * from "./models/Organization";
export * from "./models/Project";
export * from "./models/User";

const appAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([z.literal("manage"), z.literal("all")])
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== "function") {
    throw new Error(`Permission for role ${user.role} not found.`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    }
  });

  return ability;
}

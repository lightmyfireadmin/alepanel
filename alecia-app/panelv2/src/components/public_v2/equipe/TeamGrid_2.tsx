"use client";

import { motion } from "framer-motion";
import { TeamMemberCard_2, TeamMemberData } from "./TeamMemberCard_2";

/**
 * TeamGrid_2 - Grille équipe style albarest-partners
 */

interface TeamGrid_2Props {
  members: TeamMemberData[];
}

export function TeamGrid_2({ members }: TeamGrid_2Props) {
  // Separate associates/partners from other team members
  const partners = members.filter(m => 
    m.role.toLowerCase().includes("associé") || 
    m.role.toLowerCase().includes("partner") ||
    m.role.toLowerCase().includes("fondateur")
  );
  const team = members.filter(m => 
    !m.role.toLowerCase().includes("associé") && 
    !m.role.toLowerCase().includes("partner") &&
    !m.role.toLowerCase().includes("fondateur")
  );

  return (
    <div className="space-y-16">
      {/* Partners Section */}
      {partners.length > 0 && (
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Associés
            </h2>
            <p className="text-[var(--foreground-muted)] mt-2">
              Les fondateurs et associés du cabinet
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TeamMemberCard_2 member={member} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Team Section */}
      {team.length > 0 && (
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              L'équipe
            </h2>
            <p className="text-[var(--foreground-muted)] mt-2">
              Nos experts en fusion-acquisition
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TeamMemberCard_2 member={member} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

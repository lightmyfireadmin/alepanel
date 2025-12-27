## 2024-05-23 - Deal Matcher Optimization
**Learning:** Drizzle ORM's `arrayContains` maps to Postgres `@>` operator, which efficiently uses GIN indexes. When filtering potentially large datasets (like matching buyers to targets), pushing the filtering logic to the database using `arrayContains` and other SQL operators is crucial to avoid memory bottlenecks and reduce latency.
**Action:** Always verify if a complex in-memory filtering loop can be replaced by a database query with appropriate indexes. For array columns, check if `arrayContains` or `arrayOverlaps` can be used.

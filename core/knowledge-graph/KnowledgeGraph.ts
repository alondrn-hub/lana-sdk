/**
 * Lana SDK - Knowledge Graph
 */
export class KnowledgeGraph {
  private triples: Array<{ subject: string; predicate: string; object: string }> = [];

  addTriple(subject: string, predicate: string, object: string) {
    this.triples.push({ subject, predicate, object });
  }

  query(subject?: string) {
    if (subject) {
      return this.triples.filter(t => t.subject === subject);
    }
    return this.triples;
  }
}

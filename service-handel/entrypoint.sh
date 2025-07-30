#!/bin/sh

# Bygg opp argumentene for Java-appen
JAVA_ARGS="-jar app.jar"

# Sjekk om PORT-variabelen er satt og ikke er tom
if [ -n "$PORT" ]; then
  # Legg til server.port argumentet hvis PORT eksisterer
  JAVA_ARGS="$JAVA_ARGS --server.port=$PORT"
fi

# Kjør Java-appen med de sammensatte argumentene
exec java $JAVA_ARGS
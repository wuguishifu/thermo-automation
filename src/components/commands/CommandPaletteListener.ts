'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useCommands } from '@/components/commands/useCommands';
import { useValueAsRef } from '@/lib/utils';

const CHORD_TIMEOUT_MS = 500;

export function CommandPaletteListener() {
  const router = useRouter();
  const chordRef = useRef<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pathRef = useValueAsRef(usePathname());

  const commands = useCommands();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      const key = e.key;
      chordRef.current.push(key);

      const match = commands.find((cmd) => {
        if (cmd.chord.length !== chordRef.current.length) {
          return false;
        }
        return cmd.chord.every((k, i) => k === chordRef.current[i]);
      });

      if (match) {
        if ('action' in match.target) {
          match.target.action();
        } else if ('url' in match.target) {
          if (pathRef.current !== match.target.url) {
            router.push(match.target.url);
          }
        }
        chordRef.current = [];
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      const possible = commands.some((cmd) => {
        if (cmd.chord.length <= chordRef.current.length) {
          return false;
        }
        return cmd.chord.slice(0, chordRef.current.length).every((k, i) => k === chordRef.current[i]);
      });

      if (possible) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          chordRef.current = [];
          timerRef.current = null;
        }, CHORD_TIMEOUT_MS);
      } else {
        chordRef.current = [];
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      chordRef.current = [];
    };
  }, [router, commands, pathRef]);

  return null;
}

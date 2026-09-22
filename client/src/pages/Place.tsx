import { useState } from 'react';
import styled from 'styled-components';
import { PageHeader, PageTitle, ErrorText, SectionTitle } from '@/styles/shared';
import { Button } from '@/components/ui/Button';

// ---------------------------------------------------------------------------
// Styled components (local — only what's unique to this page)
// ---------------------------------------------------------------------------
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Tag = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.accent.lightBlue};
  color: ${({ theme }) => theme.colors.primary.slate};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ResultBox = styled.pre`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.secondary.lightGray};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  white-space: pre-wrap;
  word-break: break-word;
`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Place(): JSX.Element {
  // ── Left: fetch a single Todo ──────────────────────────────────────────
  const [todo, setTodo] = useState<Todo | null>(null);
  const [todoLoading, setTodoLoading] = useState(false);
  const [todoError, setTodoError] = useState<string | null>(null);

  const handleFetchTodo = (): void => {
    setTodoLoading(true);
    setTodoError(null);
    setTodo(null);
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((r) => r.json())
      .then((json: Todo) => {
        console.log(json);
        setTodo(json);
      })
      .catch((err: unknown) => {
        setTodoError(err instanceof Error ? err.message : 'An unknown error occurred.');
      })
      .finally(() => setTodoLoading(false));
  };

  // ── Right: fetch a single Post ─────────────────────────────────────────
  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const handleFetchPost = (): void => {
    setPostLoading(true);
    setPostError(null);
    setPost(null);
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then((r) => r.json())
      .then((json: Post) => {
        console.log(json);
        setPost(json);
      })
      .catch((err: unknown) => {
        setPostError(err instanceof Error ? err.message : 'An unknown error occurred.');
      })
      .finally(() => setPostLoading(false));
  };

  return (
    <div data-testid="place-page">
      <PageHeader>
        <PageTitle>API Examples</PageTitle>
      </PageHeader>

      <TwoCol>
        {/* ── Todo endpoint ──────────────────────────────────────────────── */}
        <Section aria-labelledby="todo-heading">
          <SectionHeader>
            <SectionTitle id="todo-heading">Fetch a Todo</SectionTitle>
            <Tag>/todos/1</Tag>
          </SectionHeader>

          <Button
            onClick={handleFetchTodo}
            isLoading={todoLoading}
            aria-label="Fetch todo from JSONPlaceholder"
            data-testid="fetch-todo-button"
          >
            Fetch Todo
          </Button>

          {todoError && (
            <ErrorText role="alert" data-testid="todo-error">
              {todoError}
            </ErrorText>
          )}
          {todo && (
            <ResultBox data-testid="todo-result">
              {JSON.stringify(todo, null, 2)}
            </ResultBox>
          )}
        </Section>

        {/* ── Post endpoint ───────────────────────────────────────────────── */}
        <Section aria-labelledby="post-heading">
          <SectionHeader>
            <SectionTitle id="post-heading">Fetch a Post</SectionTitle>
            <Tag>/posts/1</Tag>
          </SectionHeader>

          <Button
            onClick={handleFetchPost}
            isLoading={postLoading}
            aria-label="Fetch post from JSONPlaceholder"
            data-testid="fetch-post-button"
          >
            Fetch Post
          </Button>

          {postError && (
            <ErrorText role="alert" data-testid="post-error">
              {postError}
            </ErrorText>
          )}
          {post && (
            <ResultBox data-testid="post-result">
              {JSON.stringify(post, null, 2)}
            </ResultBox>
          )}
        </Section>
      </TwoCol>
    </div>
  );
}

// Made with Bob

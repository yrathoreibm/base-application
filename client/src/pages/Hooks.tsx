import { useState, useEffect, useCallback, useRef, useMemo, useReducer } from 'react';
import styled from 'styled-components';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionTitle,
  ErrorText,
} from '@/styles/shared';
import { Button } from '@/components/ui/Button';

// ---------------------------------------------------------------------------
// JSONPlaceholder types
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
// Styled components
// ---------------------------------------------------------------------------
const ConceptBlock = styled.div`
  background: ${({ theme }) => theme.colors.secondary.lightGray};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.slate};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ConceptTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary.navy};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ConceptText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const CodeSnippet = styled.pre`
  background: ${({ theme }) => theme.colors.primary.navy};
  color: #e2e8f0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  overflow-x: auto;
  margin-top: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ExampleSection = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ExampleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Tag = styled.span<{ $color?: 'green' | 'orange' | 'purple' | 'red' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $color }) =>
    $color === 'green'  ? '#dcfce7' :
    $color === 'orange' ? '#ffedd5' :
    $color === 'purple' ? '#ede9fe' :
    $color === 'red'    ? '#fee2e2' :
    '#dbeafe'};
  color: ${({ $color }) =>
    $color === 'green'  ? '#15803d' :
    $color === 'orange' ? '#c2410c' :
    $color === 'purple' ? '#6d28d9' :
    $color === 'red'    ? '#b91c1c' :
    '#1d4ed8'};
`;

const ResultBox = styled.pre`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.secondary.lightGray};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 260px;
  overflow-y: auto;
`;

const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const InlineInput = styled.input`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  width: 180px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.slate};
  }
`;

const CountDisplay = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.navy};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.secondary.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  width: 120px;
`;

const RenderCount = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary.iconGray};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const PostCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.secondary.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const PostTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: capitalize;
`;

const PostBody = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Pill = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme.colors.primary.slate : theme.colors.secondary.borderGray};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary.slate : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.secondary.white : theme.colors.secondary.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const TimerDisplay = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.navy};
  font-variant-numeric: tabular-nums;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

// ---------------------------------------------------------------------------
// useReducer types (Example 6)
// ---------------------------------------------------------------------------
interface FetchState {
  status: 'idle' | 'loading' | 'success' | 'error';
  todo: Todo | null;
  error: string | null;
}

type FetchAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Todo }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'RESET' };

function fetchReducer(state: FetchState, action: FetchAction): FetchState {
  switch (action.type) {
    case 'FETCH_START':  return { status: 'loading', todo: null, error: null };
    case 'FETCH_SUCCESS': return { status: 'success', todo: action.payload, error: null };
    case 'FETCH_ERROR':  return { status: 'error', todo: null, error: action.payload };
    case 'RESET':        return { status: 'idle', todo: null, error: null };
    default:             return state;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Hooks(): JSX.Element {

  // ── Example 1: useState ───────────────────────────────────────────────
  const [count, setCount] = useState(0);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [todoLoading, setTodoLoading] = useState(false);
  const [todoError, setTodoError] = useState<string | null>(null);

  const fetchTodo = (): void => {
    setTodoLoading(true);
    setTodoError(null);
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((r) => r.json())
      .then((data: Todo) => setTodo(data))
      .catch(() => setTodoError('Failed to fetch todo.'))
      .finally(() => setTodoLoading(false));
  };

  // ── Example 2: useEffect ──────────────────────────────────────────────
  const [postId, setPostId] = useState(1);
  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    setPostLoading(true);
    setPost(null);
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((r) => r.json())
      .then((data: Post) => setPost(data))
      .catch(() => { /* handled silently */ })
      .finally(() => setPostLoading(false));
  }, [postId]); // re-runs every time postId changes

  // ── Example 3: useCallback ────────────────────────────────────────────
  const renderCountRef = useRef(0);
  const [cbResult, setCbResult] = useState<Todo | null>(null);
  const [cbLoading, setCbLoading] = useState(false);

  // Stable reference — does NOT get recreated on every render
  const fetchWithCallback = useCallback((): void => {
    setCbLoading(true);
    fetch('https://jsonplaceholder.typicode.com/todos/2')
      .then((r) => r.json())
      .then((data: Todo) => setCbResult(data))
      .catch(() => { /* handled silently */ })
      .finally(() => setCbLoading(false));
  }, []); // empty deps → created once, never recreated

  // ── Example 4: useRef ─────────────────────────────────────────────────
  const inputRef = useRef<HTMLInputElement>(null);
  const [refValue, setRefValue] = useState('');

  const handleReadRef = (): void => {
    if (inputRef.current) {
      setRefValue(inputRef.current.value);
    }
  };

  // ── Example 5: useMemo ────────────────────────────────────────────────
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [filterUserId, setFilterUserId] = useState<number | null>(null);

  const fetchAllPosts = (): void => {
    setPostsLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=20')
      .then((r) => r.json())
      .then((data: Post[]) => setAllPosts(data))
      .catch(() => { /* handled silently */ })
      .finally(() => setPostsLoading(false));
  };

  // useMemo recomputes only when allPosts or filterUserId changes
  const filteredPosts = useMemo(() => {
    if (filterUserId === null) return allPosts;
    return allPosts.filter((p) => p.userId === filterUserId);
  }, [allPosts, filterUserId]);

  const userIds = useMemo(
    () => [...new Set(allPosts.map((p) => p.userId))].sort((a, b) => a - b),
    [allPosts]
  );

  // ── Example 6: useReducer ─────────────────────────────────────────────
  const [reducerTodoId, setReducerTodoId] = useState(3);
  const [state, dispatch] = useReducer(fetchReducer, {
    status: 'idle',
    todo: null,
    error: null,
  });

  const handleReducerFetch = (): void => {
    dispatch({ type: 'FETCH_START' });
    fetch(`https://jsonplaceholder.typicode.com/todos/${reducerTodoId}`)
      .then((r) => r.json())
      .then((data: Todo) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        dispatch({ type: 'FETCH_ERROR', payload: msg });
      });
  };

  // track renders for Example 3 demo
  renderCountRef.current += 1;

  return (
    <div data-testid="hooks-page">
      <PageHeader>
        <div>
          <PageTitle>React Hooks Explorer</PageTitle>
          <PageSubtitle>
            Live examples of every core React hook — useState, useEffect, useCallback,
            useRef, useMemo, and useReducer — all using the JSONPlaceholder API.
          </PageSubtitle>
        </div>
      </PageHeader>

      {/* ── What are hooks? ───────────────────────────────────────────────── */}
      <ConceptBlock>
        <ConceptTitle>What are React Hooks?</ConceptTitle>
        <ConceptText>
          Hooks let you use state and other React features inside function components.
          They always start with <code>use</code>, must be called at the top level of a
          component (not inside loops or conditions), and each hook solves a specific problem.
        </ConceptText>
        <CodeSnippet>{`// Rules of Hooks:
// 1. Only call hooks at the TOP LEVEL of a function component
// 2. Only call hooks from REACT FUNCTION COMPONENTS (or custom hooks)
// 3. Hook names always start with "use"

import { useState, useEffect, useCallback, useRef, useMemo, useReducer } from 'react';`}</CodeSnippet>
      </ConceptBlock>

      {/* ── Example 1: useState ───────────────────────────────────────────── */}
      <ExampleSection aria-labelledby="h1-heading">
        <ExampleHeader>
          <SectionTitle id="h1-heading">Example 1 — useState</SectionTitle>
          <Tag $color="green">STATE</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useState</strong> stores a value that, when updated, causes the component to
          re-render. It returns a pair: the current value and a setter function. Here it stores
          a counter and a fetched todo from the API.
        </ConceptText>
        <CodeSnippet>{`const [count, setCount] = useState(0);
const [todo, setTodo] = useState<Todo | null>(null);

// Updating state triggers a re-render:
setCount(count + 1);          // from a click
setTodo(data);                // from a fetch result`}</CodeSnippet>

        <InputRow>
          <Button variant="secondary" onClick={() => setCount((c) => c - 1)} aria-label="Decrement">−</Button>
          <CountDisplay>{count}</CountDisplay>
          <Button onClick={() => setCount((c) => c + 1)} aria-label="Increment">+</Button>
          <Button variant="ghost" onClick={() => setCount(0)} aria-label="Reset count">Reset</Button>
        </InputRow>

        <Button
          onClick={fetchTodo}
          isLoading={todoLoading}
          aria-label="Fetch todo"
          data-testid="fetch-todo-button"
        >
          Fetch Todo #1
        </Button>
        {todoError && <ErrorText role="alert">{todoError}</ErrorText>}
        {todo && (
          <ResultBox data-testid="todo-result">
            {JSON.stringify(todo, null, 2)}
          </ResultBox>
        )}
      </ExampleSection>

      {/* ── Example 2: useEffect ─────────────────────────────────────────── */}
      <ExampleSection aria-labelledby="h2-heading">
        <ExampleHeader>
          <SectionTitle id="h2-heading">Example 2 — useEffect</SectionTitle>
          <Tag $color="orange">EFFECT</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useEffect</strong> runs a side-effect after render. The dependency array
          controls when it re-runs — here the post re-fetches every time you change the ID.
          Changing the number below triggers a new API call automatically, no button needed.
        </ConceptText>
        <CodeSnippet>{`useEffect(() => {
  fetch(\`https://jsonplaceholder.typicode.com/posts/\${postId}\`)
    .then(r => r.json())
    .then(data => setPost(data));
}, [postId]);  // ← re-runs whenever postId changes`}</CodeSnippet>

        <InputRow>
          <Button variant="secondary" onClick={() => setPostId((id) => Math.max(1, id - 1))} aria-label="Previous post">← Prev</Button>
          <CountDisplay style={{ fontSize: '16px', width: 'auto', padding: '8px 16px' }}>Post #{postId}</CountDisplay>
          <Button onClick={() => setPostId((id) => Math.min(100, id + 1))} aria-label="Next post">Next →</Button>
        </InputRow>

        {postLoading && <ConceptText>Fetching post…</ConceptText>}
        {post && (
          <PostCard data-testid="post-result">
            <PostTitle>{post.title}</PostTitle>
            <PostBody>{post.body}</PostBody>
          </PostCard>
        )}
      </ExampleSection>

      {/* ── Example 3: useCallback ────────────────────────────────────────── */}
      <ExampleSection aria-labelledby="h3-heading">
        <ExampleHeader>
          <SectionTitle id="h3-heading">Example 3 — useCallback</SectionTitle>
          <Tag $color="purple">MEMO</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useCallback</strong> memoises a function so it keeps the same reference
          between renders. This matters when passing callbacks to child components wrapped in{' '}
          <code>React.memo</code> — without it, every parent re-render creates a new function,
          causing the child to re-render unnecessarily.
        </ConceptText>
        <CodeSnippet>{`// WITHOUT useCallback — new function reference every render:
const fetchData = () => { fetch(...) };

// WITH useCallback — same reference, only recreated if deps change:
const fetchData = useCallback(() => {
  fetch('https://jsonplaceholder.typicode.com/todos/2')
    .then(r => r.json())
    .then(data => setCbResult(data));
}, []);  // empty deps → created once`}</CodeSnippet>

        <RenderCount>This component has rendered {renderCountRef.current} time(s). The callback below keeps the same reference.</RenderCount>

        <Button
          onClick={fetchWithCallback}
          isLoading={cbLoading}
          aria-label="Fetch with useCallback"
          data-testid="fetch-callback-button"
        >
          Fetch Todo #2 (memoised)
        </Button>
        {cbResult && (
          <ResultBox data-testid="callback-result">
            {JSON.stringify(cbResult, null, 2)}
          </ResultBox>
        )}
      </ExampleSection>

      {/* ── Example 4: useRef ─────────────────────────────────────────────── */}
      <ExampleSection aria-labelledby="h4-heading">
        <ExampleHeader>
          <SectionTitle id="h4-heading">Example 4 — useRef</SectionTitle>
          <Tag $color="orange">REF</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useRef</strong> has two uses: (1) hold a direct reference to a DOM element
          without triggering a re-render, and (2) store a mutable value that persists between
          renders but does <em>not</em> cause a re-render when changed (unlike useState). The
          render counter above uses a ref — updating it doesn't re-render the page.
        </ConceptText>
        <CodeSnippet>{`const inputRef = useRef<HTMLInputElement>(null);

// Access the DOM node directly — no re-render:
inputRef.current?.focus();
const value = inputRef.current?.value;

// Attach to a DOM element:
<input ref={inputRef} />`}</CodeSnippet>

        <InputRow>
          <InlineInput
            ref={inputRef}
            type="text"
            placeholder="Type something…"
            aria-label="Ref demo input"
            data-testid="ref-input"
          />
          <Button onClick={handleReadRef} aria-label="Read ref value" data-testid="read-ref-button">
            Read Value
          </Button>
          <Button variant="ghost" onClick={() => inputRef.current?.focus()} aria-label="Focus input">
            Focus Input
          </Button>
        </InputRow>
        {refValue && (
          <ConceptText data-testid="ref-result">
            Value read from DOM ref: <strong>{refValue}</strong>
          </ConceptText>
        )}
      </ExampleSection>

      {/* ── Example 5: useMemo ────────────────────────────────────────────── */}
      <ExampleSection aria-labelledby="h5-heading">
        <ExampleHeader>
          <SectionTitle id="h5-heading">Example 5 — useMemo</SectionTitle>
          <Tag $color="purple">MEMO</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useMemo</strong> caches the result of an expensive computation. It only
          recalculates when its dependencies change. Here, filtering 20 posts by userId is
          memoised — clicking a filter pill does not re-run the full filter if posts haven't changed.
        </ConceptText>
        <CodeSnippet>{`const filteredPosts = useMemo(() => {
  if (filterUserId === null) return allPosts;
  return allPosts.filter(p => p.userId === filterUserId);
}, [allPosts, filterUserId]);  // only recomputes when these change`}</CodeSnippet>

        <Button
          onClick={fetchAllPosts}
          isLoading={postsLoading}
          aria-label="Fetch posts"
          data-testid="fetch-posts-button"
        >
          Fetch 20 Posts
        </Button>

        {allPosts.length > 0 && (
          <>
            <FilterRow style={{ marginTop: '12px' }}>
              <Pill $active={filterUserId === null} onClick={() => setFilterUserId(null)}>All ({allPosts.length})</Pill>
              {userIds.map((uid) => (
                <Pill
                  key={uid}
                  $active={filterUserId === uid}
                  onClick={() => setFilterUserId(uid)}
                >
                  User {uid}
                </Pill>
              ))}
            </FilterRow>
            <ConceptText>Showing {filteredPosts.length} post(s)</ConceptText>
            {filteredPosts.slice(0, 4).map((p) => (
              <PostCard key={p.id} data-testid={`post-${p.id}`}>
                <PostTitle>{p.title}</PostTitle>
                <PostBody>{p.body}</PostBody>
              </PostCard>
            ))}
          </>
        )}
      </ExampleSection>

      {/* ── Example 6: useReducer ─────────────────────────────────────────── */}
      <ExampleSection aria-labelledby="h6-heading">
        <ExampleHeader>
          <SectionTitle id="h6-heading">Example 6 — useReducer</SectionTitle>
          <Tag $color="red">REDUCER</Tag>
        </ExampleHeader>

        <ConceptText>
          <strong>useReducer</strong> is like useState but for complex state with multiple
          sub-values or transitions. You dispatch <em>actions</em> and a pure <em>reducer</em>{' '}
          function decides the next state. It's the same pattern as Redux, built into React.
        </ConceptText>
        <CodeSnippet>{`type FetchAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Todo }
  | { type: 'FETCH_ERROR';   payload: string }
  | { type: 'RESET' };

function fetchReducer(state, action): FetchState {
  switch (action.type) {
    case 'FETCH_START':   return { status: 'loading', todo: null, error: null };
    case 'FETCH_SUCCESS': return { status: 'success', todo: action.payload, error: null };
    case 'FETCH_ERROR':   return { status: 'error',   todo: null, error: action.payload };
    case 'RESET':         return { status: 'idle',    todo: null, error: null };
  }
}

const [state, dispatch] = useReducer(fetchReducer, { status: 'idle', todo: null, error: null });

// Trigger transitions:
dispatch({ type: 'FETCH_START' });
dispatch({ type: 'FETCH_SUCCESS', payload: data });`}</CodeSnippet>

        <InputRow>
          <Button variant="secondary" onClick={() => setReducerTodoId((id) => Math.max(1, id - 1))} aria-label="Previous todo">← Prev</Button>
          <CountDisplay style={{ fontSize: '14px', width: 'auto', padding: '8px 16px' }}>Todo #{reducerTodoId}</CountDisplay>
          <Button variant="secondary" onClick={() => setReducerTodoId((id) => Math.min(200, id + 1))} aria-label="Next todo">Next →</Button>
        </InputRow>

        <InputRow>
          <Button
            onClick={handleReducerFetch}
            isLoading={state.status === 'loading'}
            aria-label="Fetch todo with reducer"
            data-testid="fetch-reducer-button"
          >
            Dispatch FETCH_START
          </Button>
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: 'RESET' })}
            aria-label="Reset state"
            data-testid="reset-reducer-button"
          >
            Dispatch RESET
          </Button>
        </InputRow>

        <ConceptText>
          Current status: <strong>{state.status}</strong>
        </ConceptText>

        {state.error && <ErrorText role="alert">{state.error}</ErrorText>}
        {state.todo && (
          <ResultBox data-testid="reducer-result">
            {JSON.stringify(state.todo, null, 2)}
          </ResultBox>
        )}
      </ExampleSection>
    </div>
  );
}

// Made with Bob

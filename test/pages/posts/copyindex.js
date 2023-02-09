import { getSortedPostsData } from '../lib/posts';


export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
    revalidate: 60
  };
}


export default function copyIndex({ allPostsData }) {
  return (
    <div>test</div>
  );
}

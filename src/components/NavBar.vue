<template>
<nav class="nav-container">
  <div>
    <RouterLink to="/">
      <span>XVVQAQ's Blog</span>
    </RouterLink>
  </div>
  <div class="nav-items">
    <!--导航栏-->
    <RouterLink to="/">首页</RouterLink>
    <RouterLink to="/archive">归档</RouterLink>
    <RouterLink to="/tags">标签</RouterLink>
    <RouterLink to="/about">关于</RouterLink>
    <!--功能栏-->
  </div>
</nav>
</template>


<style scoped>
.nav-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
}
.nav-items{
  position: absolute;
  right: 50px ;
  font:bold 18px "Helvetica Neue",Helvetica,Arial,sans-serif;
}
.nav-items a{
  text-decoration: none;
  margin: 0 10px;
}
.nav-items a:hover{
  text-decoration: none;
  background-color: dimgray;
  color: orange;
  transition: background-color 200ms ease,color 200ms ease;
}
</style>

<script setup lang="ts">
  import { RouterLink } from "vue-router";

</script>

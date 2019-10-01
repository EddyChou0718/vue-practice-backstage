<template>
    <div>
        <navBar></navBar>
        <alertMessage></alertMessage>
        <div class="container-fluid">
            <div class="row">
                <sideBar></sideBar>
                <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import navBar from '@/components/navBar'
import sideBar from '@/components/sideBar'
import alertMessage from '@/components/alertMessage'
export default {
    components: {
        navBar,
        sideBar,
        alertMessage,
    }
}
</script> 